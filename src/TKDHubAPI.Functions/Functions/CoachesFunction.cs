using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using TKDHubAPI.Application.DTOs.User;
using TKDHubAPI.Application.Interfaces;
using TKDHubFunctions.Helpers;

namespace TKDHubFunctions.Functions;

public class CoachesFunction
{
    private readonly ILogger<CoachesFunction> _logger;
    private readonly IUserService _userService;
    private readonly ICoachService _coachService;

    public CoachesFunction(ILogger<CoachesFunction> logger, IUserService userService, ICoachService coachService)
    {
        _logger = logger;
        _userService = userService;
        _coachService = coachService;
    }

    [Function("GetAllCoaches")]
    public async Task<HttpResponseData> GetAllCoaches(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "api/coaches")] HttpRequestData req)
    {
        try
        {
            _logger.LogInformation("Getting all coaches");
            
            var coaches = await _coachService.GetAllCoachesAsync();
            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(coaches);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all coaches");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
            return errorResponse;
        }
    }

    [Function("GetCoachById")]
    public async Task<HttpResponseData> GetCoachById(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "api/coaches/{id:int}")] HttpRequestData req,
        int id)
    {
        try
        {
            _logger.LogInformation("Getting coach with ID: {CoachId}", id);
            
            var coach = await _coachService.GetCoachByIdAsync(id);
            if (coach == null)
            {
                var notFound = req.CreateResponse(HttpStatusCode.NotFound);
                CorsHelper.SetCorsHeaders(notFound);
                await notFound.WriteAsJsonAsync(new { message = "Coach not found" });
                return notFound;
            }

            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(coach);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting coach with ID: {CoachId}", id);
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
            return errorResponse;
        }
    }

    [Function("CreateCoach")]
    public async Task<HttpResponseData> CreateCoach(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "api/coaches")] HttpRequestData req)
    {
        try
        {
            _logger.LogInformation("Creating new coach");
            
            var body = await req.ReadAsStringAsync();
            var createUserDto = JsonSerializer.Deserialize<CreateUserDto>(body, 
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (createUserDto == null)
            {
                var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequest);
                await badRequest.WriteAsJsonAsync(new { message = "Invalid request data" });
                return badRequest;
            }
            
            var result = await _userService.CreateUserAsync(0, new[] { "Admin" }, createUserDto);
            
            var response = req.CreateResponse(HttpStatusCode.Created);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(result);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating coach");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
            return errorResponse;
        }
    }

    [Function("UpdateCoach")]
    public async Task<HttpResponseData> UpdateCoach(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "api/coaches/{id:int}")] HttpRequestData req,
        int id)
    {
        try
        {
            _logger.LogInformation("Updating coach with ID: {CoachId}", id);
            
            var body = await req.ReadAsStringAsync();
            var updateCoachDto = JsonSerializer.Deserialize<UpdateUserDto>(body, 
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (updateCoachDto == null)
            {
                var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequest);
                await badRequest.WriteAsJsonAsync(new { message = "Invalid request data" });
                return badRequest;
            }

            await _userService.UpdateUserFromDtoAsync(id, updateCoachDto);
            
            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(new { message = "Coach updated successfully" });
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating coach with ID: {CoachId}", id);
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
            return errorResponse;
        }
    }

    [Function("CoachesOptions")]
    public async Task<HttpResponseData> CoachesOptions(
        [HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = "api/coaches/{*route}")] HttpRequestData req)
    {
        _logger.LogInformation("CORS preflight request for Coaches endpoints");
        var response = CorsHelper.CreateCorsResponse(req);
        return response;
    }
}
