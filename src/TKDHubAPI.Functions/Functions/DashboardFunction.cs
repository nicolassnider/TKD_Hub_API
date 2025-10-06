using System.Net;
using System.Text.Json;
using MediatR;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using TKDHubAPI.Application.CQRS.Commands.Dashboard;
using TKDHubAPI.Application.CQRS.Queries.Dashboard;
using TKDHubAPI.Application.DTOs.Dashboard;
using TKDHubFunctions.Helpers;

namespace TKDHubFunctions.Functions;

public class DashboardFunction
{
    private readonly ILogger<DashboardFunction> _logger;
    private readonly IMediator _mediator;

    public DashboardFunction(ILogger<DashboardFunction> logger, IMediator mediator)
    {
        _logger = logger;
        _mediator = mediator;
    }

    [Function("GetDashboard")]
    public async Task<HttpResponseData> GetDashboard(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "dashboards")] HttpRequestData req
    )
    {
        try
        {
            // Extract user info from JWT token
            var (isAuthenticated, userId, userRole) = JwtHelper.ExtractUserInfo(req);
            if (!isAuthenticated)
            {
                var unauthorizedResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
                CorsHelper.SetCorsHeaders(unauthorizedResponse);
                await unauthorizedResponse.WriteAsJsonAsync(
                    new { message = "Unauthorized access" }
                );
                return unauthorizedResponse;
            }

            // Parse query parameters
            var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
            var targetUserId = int.TryParse(query["userId"], out var uid) ? uid : userId;
            var targetUserRole = query["userRole"] ?? userRole;
            var layoutId = query["layoutId"];
            var startDate = query["startDate"];
            var endDate = query["endDate"];
            var filters = query["filters"];
            var widgetIds = query["widgetIds"];

            _logger.LogInformation(
                "Getting dashboard for user {UserId} with role {UserRole}",
                targetUserId,
                targetUserRole
            );

            var dashboardQuery = new GetDashboardQuery(
                targetUserId,
                targetUserRole,
                layoutId,
                startDate,
                endDate,
                filters,
                widgetIds
            );

            var dashboard = await _mediator.Send(dashboardQuery);

            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(new { data = dashboard });
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting dashboard");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(
                new { message = "An error occurred while retrieving the dashboard" }
            );
            return errorResponse;
        }
    }

    [Function("GetDashboardLayouts")]
    public async Task<HttpResponseData> GetLayouts(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "dashboards/layouts")]
            HttpRequestData req
    )
    {
        try
        {
            var (isAuthenticated, userId, userRole) = JwtHelper.ExtractUserInfo(req);
            if (!isAuthenticated)
            {
                var unauthorizedResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
                CorsHelper.SetCorsHeaders(unauthorizedResponse);
                await unauthorizedResponse.WriteAsJsonAsync(
                    new { message = "Unauthorized access" }
                );
                return unauthorizedResponse;
            }

            var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
            var targetUserId = int.TryParse(query["userId"], out var uid) ? uid : userId;

            _logger.LogInformation("Getting layouts for user {UserId}", targetUserId);

            var layoutsQuery = new GetDashboardLayoutsQuery(targetUserId);
            var layouts = await _mediator.Send(layoutsQuery);

            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(new { data = layouts });
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting layouts");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(
                new { message = "An error occurred while retrieving the layouts" }
            );
            return errorResponse;
        }
    }

    [Function("GetDefaultLayout")]
    public async Task<HttpResponseData> GetDefaultLayout(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "dashboards/default/{userRole}")]
            HttpRequestData req,
        string userRole
    )
    {
        try
        {
            var (isAuthenticated, userId, currentUserRole) = JwtHelper.ExtractUserInfo(req);
            if (!isAuthenticated)
            {
                var unauthorizedResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
                CorsHelper.SetCorsHeaders(unauthorizedResponse);
                await unauthorizedResponse.WriteAsJsonAsync(
                    new { message = "Unauthorized access" }
                );
                return unauthorizedResponse;
            }

            _logger.LogInformation("Getting default layout for role {UserRole}", userRole);

            var query = new GetDefaultDashboardQuery(userRole);
            var layout = await _mediator.Send(query);

            if (layout == null)
            {
                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                CorsHelper.SetCorsHeaders(notFoundResponse);
                await notFoundResponse.WriteAsJsonAsync(
                    new { message = $"No default layout found for role {userRole}" }
                );
                return notFoundResponse;
            }

            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(new { data = layout });
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting default layout for role {UserRole}", userRole);
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(
                new { message = "An error occurred while retrieving the default layout" }
            );
            return errorResponse;
        }
    }

    [Function("CreateDashboardLayout")]
    public async Task<HttpResponseData> CreateLayout(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "dashboards/layouts")]
            HttpRequestData req
    )
    {
        try
        {
            var (isAuthenticated, userId, userRole) = JwtHelper.ExtractUserInfo(req);
            if (!isAuthenticated)
            {
                var unauthorizedResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
                CorsHelper.SetCorsHeaders(unauthorizedResponse);
                await unauthorizedResponse.WriteAsJsonAsync(
                    new { message = "Unauthorized access" }
                );
                return unauthorizedResponse;
            }

            var body = await req.ReadAsStringAsync();
            var layout = JsonSerializer.Deserialize<DashboardLayoutDto>(
                body,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            );

            if (layout == null)
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(new { message = "Invalid layout data" });
                return badRequestResponse;
            }

            _logger.LogInformation("Creating layout for user {UserId}", userId);

            var command = new CreateDashboardLayoutCommand(layout);
            var createdLayout = await _mediator.Send(command);

            var response = req.CreateResponse(HttpStatusCode.Created);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(new { data = createdLayout });
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating layout");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(
                new { message = "An error occurred while creating the layout" }
            );
            return errorResponse;
        }
    }

    [Function("UpdateDashboardLayout")]
    public async Task<HttpResponseData> UpdateLayout(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "dashboards/layouts/{id}")]
            HttpRequestData req,
        string id
    )
    {
        try
        {
            var (isAuthenticated, userId, userRole) = JwtHelper.ExtractUserInfo(req);
            if (!isAuthenticated)
            {
                var unauthorizedResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
                CorsHelper.SetCorsHeaders(unauthorizedResponse);
                await unauthorizedResponse.WriteAsJsonAsync(
                    new { message = "Unauthorized access" }
                );
                return unauthorizedResponse;
            }

            var body = await req.ReadAsStringAsync();
            var layout = JsonSerializer.Deserialize<DashboardLayoutDto>(
                body,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            );

            if (layout == null)
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(new { message = "Invalid layout data" });
                return badRequestResponse;
            }

            layout.Id = id; // Ensure the ID matches the route parameter

            _logger.LogInformation("Updating layout {LayoutId} for user {UserId}", id, userId);

            var command = new UpdateDashboardLayoutCommand(id, layout);
            var updatedLayout = await _mediator.Send(command);

            if (updatedLayout == null)
            {
                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                CorsHelper.SetCorsHeaders(notFoundResponse);
                await notFoundResponse.WriteAsJsonAsync(new { message = "Layout not found" });
                return notFoundResponse;
            }

            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(new { data = updatedLayout });
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating layout {LayoutId}", id);
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(
                new { message = "An error occurred while updating the layout" }
            );
            return errorResponse;
        }
    }

    [Function("DeleteDashboardLayout")]
    public async Task<HttpResponseData> DeleteLayout(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "dashboards/layouts/{id}")]
            HttpRequestData req,
        string id
    )
    {
        try
        {
            var (isAuthenticated, userId, userRole) = JwtHelper.ExtractUserInfo(req);
            if (!isAuthenticated)
            {
                var unauthorizedResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
                CorsHelper.SetCorsHeaders(unauthorizedResponse);
                await unauthorizedResponse.WriteAsJsonAsync(
                    new { message = "Unauthorized access" }
                );
                return unauthorizedResponse;
            }

            _logger.LogInformation("Deleting layout {LayoutId} for user {UserId}", id, userId);

            var command = new DeleteDashboardLayoutCommand(id);
            var result = await _mediator.Send(command);

            if (!result)
            {
                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                CorsHelper.SetCorsHeaders(notFoundResponse);
                await notFoundResponse.WriteAsJsonAsync(new { message = "Layout not found" });
                return notFoundResponse;
            }

            var response = req.CreateResponse(HttpStatusCode.NoContent);
            CorsHelper.SetCorsHeaders(response);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting layout {LayoutId}", id);
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(
                new { message = "An error occurred while deleting the layout" }
            );
            return errorResponse;
        }
    }

    [Function("CreateWidget")]
    public async Task<HttpResponseData> CreateWidget(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "dashboards/widgets")]
            HttpRequestData req
    )
    {
        try
        {
            var (isAuthenticated, userId, userRole) = JwtHelper.ExtractUserInfo(req);
            if (!isAuthenticated)
            {
                var unauthorizedResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
                CorsHelper.SetCorsHeaders(unauthorizedResponse);
                await unauthorizedResponse.WriteAsJsonAsync(
                    new { message = "Unauthorized access" }
                );
                return unauthorizedResponse;
            }

            var body = await req.ReadAsStringAsync();
            var widget = JsonSerializer.Deserialize<WidgetDto>(
                body,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            );

            if (widget == null)
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(new { message = "Invalid widget data" });
                return badRequestResponse;
            }

            _logger.LogInformation("Creating widget for user {UserId}", userId);

            var command = new CreateWidgetCommand(widget);
            var createdWidget = await _mediator.Send(command);

            var response = req.CreateResponse(HttpStatusCode.Created);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(new { data = createdWidget });
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating widget");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(
                new { message = "An error occurred while creating the widget" }
            );
            return errorResponse;
        }
    }

    [Function("UpdateWidget")]
    public async Task<HttpResponseData> UpdateWidget(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "dashboards/widgets/{id}")]
            HttpRequestData req,
        string id
    )
    {
        try
        {
            var (isAuthenticated, userId, userRole) = JwtHelper.ExtractUserInfo(req);
            if (!isAuthenticated)
            {
                var unauthorizedResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
                CorsHelper.SetCorsHeaders(unauthorizedResponse);
                await unauthorizedResponse.WriteAsJsonAsync(
                    new { message = "Unauthorized access" }
                );
                return unauthorizedResponse;
            }

            var body = await req.ReadAsStringAsync();
            var widget = JsonSerializer.Deserialize<WidgetDto>(
                body,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            );

            if (widget == null)
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(new { message = "Invalid widget data" });
                return badRequestResponse;
            }

            widget.Id = id; // Ensure the ID matches the route parameter

            _logger.LogInformation("Updating widget {WidgetId} for user {UserId}", id, userId);

            var command = new UpdateWidgetCommand(id, widget);
            var updatedWidget = await _mediator.Send(command);

            if (updatedWidget == null)
            {
                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                CorsHelper.SetCorsHeaders(notFoundResponse);
                await notFoundResponse.WriteAsJsonAsync(new { message = "Widget not found" });
                return notFoundResponse;
            }

            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(new { data = updatedWidget });
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating widget {WidgetId}", id);
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(
                new { message = "An error occurred while updating the widget" }
            );
            return errorResponse;
        }
    }

    [Function("DeleteWidget")]
    public async Task<HttpResponseData> DeleteWidget(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "dashboards/widgets/{id}")]
            HttpRequestData req,
        string id
    )
    {
        try
        {
            var (isAuthenticated, userId, userRole) = JwtHelper.ExtractUserInfo(req);
            if (!isAuthenticated)
            {
                var unauthorizedResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
                CorsHelper.SetCorsHeaders(unauthorizedResponse);
                await unauthorizedResponse.WriteAsJsonAsync(
                    new { message = "Unauthorized access" }
                );
                return unauthorizedResponse;
            }

            _logger.LogInformation("Deleting widget {WidgetId} for user {UserId}", id, userId);

            var command = new DeleteWidgetCommand(id);
            var result = await _mediator.Send(command);

            if (!result)
            {
                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                CorsHelper.SetCorsHeaders(notFoundResponse);
                await notFoundResponse.WriteAsJsonAsync(new { message = "Widget not found" });
                return notFoundResponse;
            }

            var response = req.CreateResponse(HttpStatusCode.NoContent);
            CorsHelper.SetCorsHeaders(response);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting widget {WidgetId}", id);
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(
                new { message = "An error occurred while deleting the widget" }
            );
            return errorResponse;
        }
    }

    [Function("DashboardOptions")]
    public async Task<HttpResponseData> DashboardOptions(
        [HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = "dashboards/{*route}")]
            HttpRequestData req
    )
    {
        var response = req.CreateResponse(HttpStatusCode.NoContent);
        CorsHelper.SetCorsHeaders(response);
        return response;
    }
}
