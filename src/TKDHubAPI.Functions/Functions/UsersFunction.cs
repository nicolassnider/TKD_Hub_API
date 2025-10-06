using System.Net;
using System.Text.Json;
using AutoMapper;
using MediatR;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using TKDHubAPI.Application.CQRS.Commands.Users;
using TKDHubAPI.Application.CQRS.Queries.Users;
using TKDHubAPI.Application.DTOs.User;
using TKDHubAPI.Application.Interfaces;
using TKDHubFunctions.Helpers;

namespace TKDHubFunctions.Functions;

public class UsersFunction
{
    private readonly ILogger<UsersFunction> _logger;
    private readonly IUserService _userService;
    private readonly IMapper _mapper;
    private readonly IMediator _mediator;

    public UsersFunction(
        ILogger<UsersFunction> logger,
        IUserService userService,
        IMapper mapper,
        IMediator mediator
    )
    {
        _logger = logger;
        _userService = userService;
        _mapper = mapper;
        _mediator = mediator;
    }

    [Function("GetAllUsers")]
    public async Task<HttpResponseData> GetAllUsers(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "users")] HttpRequestData req
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

            // Parse pagination parameters
            var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
            var page = int.TryParse(query["page"], out var p) ? p : 1;
            var pageSize = int.TryParse(query["pageSize"], out var ps) ? ps : 0;

            _logger.LogInformation(
                "Getting all users with pagination - page: {Page}, pageSize: {PageSize}",
                page,
                pageSize
            );

            var getUsersQuery = new GetAllUsersQuery(page, pageSize);
            var paginatedResult = await _mediator.Send(getUsersQuery);

            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(new { data = paginatedResult });
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all users");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(
                new { message = "An error occurred while retrieving users" }
            );
            return errorResponse;
        }
    }

    [Function("GetUserById")]
    public async Task<HttpResponseData> GetUserById(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "users/{id:int}")]
            HttpRequestData req,
        int id
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

            _logger.LogInformation("Getting user by ID: {UserId}", id);

            var query = new GetUserByIdQuery(id);
            var userDto = await _mediator.Send(query);

            if (userDto == null)
            {
                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                CorsHelper.SetCorsHeaders(notFoundResponse);
                await notFoundResponse.WriteAsJsonAsync(new { message = "User not found" });
                return notFoundResponse;
            }

            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(new { data = userDto });
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user by ID: {UserId}", id);
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(
                new { message = "An error occurred while retrieving the user" }
            );
            return errorResponse;
        }
    }

    [Function("CreateUser")]
    public async Task<HttpResponseData> CreateUser(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "users")] HttpRequestData req
    )
    {
        try
        {
            var (isAuthenticated, userId, userRole) = JwtHelper.ExtractUserInfo(req);
            if (!isAuthenticated || !JwtHelper.IsInRole(req, "Admin"))
            {
                var unauthorizedResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
                CorsHelper.SetCorsHeaders(unauthorizedResponse);
                await unauthorizedResponse.WriteAsJsonAsync(
                    new { message = "Unauthorized access" }
                );
                return unauthorizedResponse;
            }

            var body = await req.ReadAsStringAsync();
            if (string.IsNullOrEmpty(body))
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(
                    new { message = "Request body is required" }
                );
                return badRequestResponse;
            }

            var createUserDto = JsonSerializer.Deserialize<CreateUserDto>(
                body,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            );

            if (createUserDto == null)
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(new { message = "Invalid user data" });
                return badRequestResponse;
            }

            _logger.LogInformation("Creating user with email: {Email}", createUserDto.Email);

            // Extract current user roles for the command
            var currentUserRoles = new[] { userRole };
            var command = new CreateUserCommand(userId, currentUserRoles, createUserDto);
            var createdUser = await _mediator.Send(command);

            var response = req.CreateResponse(HttpStatusCode.Created);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(new { data = createdUser });
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(
                new { message = "An error occurred while creating the user" }
            );
            return errorResponse;
        }
    }

    [Function("UpdateUser")]
    public async Task<HttpResponseData> UpdateUser(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "users/{id:int}")]
            HttpRequestData req,
        int id
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
            if (string.IsNullOrEmpty(body))
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(
                    new { message = "Request body is required" }
                );
                return badRequestResponse;
            }

            var updateUserDto = JsonSerializer.Deserialize<UpdateUserDto>(
                body,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            );

            if (updateUserDto == null)
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(new { message = "Invalid user data" });
                return badRequestResponse;
            }

            updateUserDto.Id = id; // Ensure the ID matches the route parameter

            _logger.LogInformation("Updating user: {UserId}", id);

            // Extract current user roles for the command
            var currentUserRoles = new[] { userRole };
            var command = new UpdateUserCommand
            {
                Id = id,
                UpdateUserDto = updateUserDto,
                RequestingUserId = userId,
                CurrentUserRoles = currentUserRoles,
            };
            var updatedUser = await _mediator.Send(command);

            if (updatedUser == null)
            {
                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                CorsHelper.SetCorsHeaders(notFoundResponse);
                await notFoundResponse.WriteAsJsonAsync(new { message = "User not found" });
                return notFoundResponse;
            }

            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(new { data = updatedUser });
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user: {UserId}", id);
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(
                new { message = "An error occurred while updating the user" }
            );
            return errorResponse;
        }
    }

    [Function("DeleteUser")]
    public async Task<HttpResponseData> DeleteUser(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "users/{id:int}")]
            HttpRequestData req,
        int id
    )
    {
        try
        {
            var (isAuthenticated, userId, userRole) = JwtHelper.ExtractUserInfo(req);
            if (!isAuthenticated || !JwtHelper.IsInRole(req, "Admin"))
            {
                var unauthorizedResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
                CorsHelper.SetCorsHeaders(unauthorizedResponse);
                await unauthorizedResponse.WriteAsJsonAsync(
                    new { message = "Unauthorized access" }
                );
                return unauthorizedResponse;
            }

            _logger.LogInformation("Deleting user: {UserId}", id);

            var command = new DeleteUserCommand(id);
            await _mediator.Send(command);

            // DeleteUserCommand returns Unit, so we assume success if no exception is thrown

            var response = req.CreateResponse(HttpStatusCode.NoContent);
            CorsHelper.SetCorsHeaders(response);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user: {UserId}", id);
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(
                new { message = "An error occurred while deleting the user" }
            );
            return errorResponse;
        }
    }

    [Function("GetCurrentUserMe")]
    public async Task<HttpResponseData> Me(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "users/me")] HttpRequestData req
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

            _logger.LogInformation("Getting current user info for user: {UserId}", userId);

            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
            {
                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                CorsHelper.SetCorsHeaders(notFoundResponse);
                await notFoundResponse.WriteAsJsonAsync(new { message = "User not found" });
                return notFoundResponse;
            }

            // Map to DTO for returning via standardized response
            var userDto = _mapper.Map<UserDto>(user);

            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(new { data = userDto });
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting current user info");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(
                new { message = "An error occurred while retrieving user information" }
            );
            return errorResponse;
        }
    }

    [Function("ReactivateUser")]
    public async Task<HttpResponseData> ReactivateUser(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "users/{id:int}/reactivate")]
            HttpRequestData req,
        int id
    )
    {
        try
        {
            var (isAuthenticated, userId, userRole) = JwtHelper.ExtractUserInfo(req);
            if (!isAuthenticated || !JwtHelper.IsInRole(req, "Admin"))
            {
                var unauthorizedResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
                CorsHelper.SetCorsHeaders(unauthorizedResponse);
                await unauthorizedResponse.WriteAsJsonAsync(
                    new { message = "Unauthorized access" }
                );
                return unauthorizedResponse;
            }

            _logger.LogInformation("Reactivating user: {UserId}", id);

            var user = await _userService.GetByIdAsync(id);
            if (user == null)
            {
                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                CorsHelper.SetCorsHeaders(notFoundResponse);
                await notFoundResponse.WriteAsJsonAsync(new { message = "User not found" });
                return notFoundResponse;
            }

            user.IsActive = true;
            await _userService.UpdateAsync(user);

            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(new { message = "User reactivated successfully" });
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reactivating user: {UserId}", id);
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(
                new { message = "An error occurred while reactivating the user" }
            );
            return errorResponse;
        }
    }

    [Function("UsersOptions")]
    public HttpResponseData UsersOptions(
        [HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = "users/{*route}")]
            HttpRequestData req
    )
    {
        var response = req.CreateResponse(HttpStatusCode.NoContent);
        CorsHelper.SetCorsHeaders(response);
        return response;
    }
}
