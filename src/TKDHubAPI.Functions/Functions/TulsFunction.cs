using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Domain.Entities;
using TKDHubFunctions.Helpers;

namespace TKDHubFunctions.Functions;

public class TulsFunction
{
    private readonly ILogger<TulsFunction> _logger;
    private readonly ITulService _tulService;

    public TulsFunction(ILogger<TulsFunction> logger, ITulService tulService)
    {
        _logger = logger;
        _tulService = tulService;
    }

    [Function("GetAllTuls")]
    public async Task<HttpResponseData> GetAllTuls(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Tuls")] HttpRequestData req)
    {
        try
        {
            _logger.LogInformation("Getting all tuls");

            var tuls = await _tulService.GetAllAsync();
            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(tuls);

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all tuls");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Failed to get tuls" });
            return errorResponse;
        }
    }

    [Function("GetTulById")]
    public async Task<HttpResponseData> GetTulById(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Tuls/{id:int}")] HttpRequestData req,
        int id)
    {
        try
        {
            _logger.LogInformation($"Getting tul with ID: {id}");

            var tul = await _tulService.GetByIdAsync(id);
            if (tul == null)
            {
                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                CorsHelper.SetCorsHeaders(notFoundResponse);
                await notFoundResponse.WriteAsJsonAsync(new { message = $"Tul with ID {id} not found" });
                return notFoundResponse;
            }

            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(tul);

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error getting tul with ID: {id}");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Failed to get tul" });
            return errorResponse;
        }
    }

    [Function("CreateTul")]
    public async Task<HttpResponseData> CreateTul(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "Tuls")] HttpRequestData req)
    {
        try
        {
            _logger.LogInformation("Creating new tul");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var tul = System.Text.Json.JsonSerializer.Deserialize<Tul>(requestBody);

            if (tul == null)
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(new { message = "Invalid tul data" });
                return badRequestResponse;
            }

            await _tulService.AddAsync(tul);
            var response = req.CreateResponse(HttpStatusCode.Created);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(tul);

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating tul");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Failed to create tul" });
            return errorResponse;
        }
    }

    [Function("UpdateTul")]
    public async Task<HttpResponseData> UpdateTul(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "Tuls/{id:int}")] HttpRequestData req,
        int id)
    {
        try
        {
            _logger.LogInformation($"Updating tul with ID: {id}");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var tul = System.Text.Json.JsonSerializer.Deserialize<Tul>(requestBody);

            if (tul == null)
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(new { message = "Invalid tul data" });
                return badRequestResponse;
            }

            tul.Id = id;
            await _tulService.UpdateAsync(tul);

            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(tul);

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error updating tul with ID: {id}");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Failed to update tul" });
            return errorResponse;
        }
    }

    [Function("DeleteTul")]
    public async Task<HttpResponseData> DeleteTul(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "Tuls/{id:int}")] HttpRequestData req,
        int id)
    {
        try
        {
            _logger.LogInformation($"Deleting tul with ID: {id}");

            await _tulService.DeleteAsync(id);

            var response = req.CreateResponse(HttpStatusCode.NoContent);
            CorsHelper.SetCorsHeaders(response);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error deleting tul with ID: {id}");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Failed to delete tul" });
            return errorResponse;
        }
    }

    [Function("TulsOptions")]
    public HttpResponseData TulsOptions(
        [HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = "Tuls/{*route}")] HttpRequestData req)
    {
        return CorsHelper.CreateCorsResponse(req);
    }
}
