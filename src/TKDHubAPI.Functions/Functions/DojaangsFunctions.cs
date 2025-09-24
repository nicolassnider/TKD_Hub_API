using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;
using TKDHubAPI.Application.DTOs.Dojaang;
using TKDHubAPI.Application.Interfaces;
using TKDHubFunctions.Helpers;

namespace TKDHubFunctions.Functions;

public class DojaangsFunction
{
    private readonly ILogger<DojaangsFunction> _logger;
    private readonly IDojaangService _dojaangService;
    private readonly IUserService _userService;

    public DojaangsFunction(ILogger<DojaangsFunction> logger, IDojaangService dojaangService, IUserService userService)
    {
        _logger = logger;
        _dojaangService = dojaangService;
        _userService = userService;
    }

    [Function("GetAllDojaangs")]
    public async Task<HttpResponseData> GetAllDojaangs(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "dojaangs")] HttpRequestData req)
    {
        try
        {
            _logger.LogInformation("Getting all dojaangs");

            var dojaangs = await _dojaangService.GetAllAsync();
            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(dojaangs);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all dojaangs");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
            return errorResponse;
        }
    }

    [Function("GetDojaangById")]
    public async Task<HttpResponseData> GetDojaangById(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "dojaangs/{id:int}")] HttpRequestData req,
        int id)
    {
        try
        {
            _logger.LogInformation("Getting dojaang with ID: {DojaangId}", id);

            var dojaang = await _dojaangService.GetByIdAsync(id);
            if (dojaang == null)
            {
                var notFound = req.CreateResponse(HttpStatusCode.NotFound);
                CorsHelper.SetCorsHeaders(notFound);
                await notFound.WriteAsJsonAsync(new { message = "Dojaang not found" });
                return notFound;
            }

            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(dojaang);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting dojaang with ID: {DojaangId}", id);
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
            return errorResponse;
        }
    }

    [Function("CreateDojaang")]
    public async Task<HttpResponseData> CreateDojaang(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "dojaangs")] HttpRequestData req)
    {
        try
        {
            _logger.LogInformation("Creating new dojaang");

            var body = await req.ReadAsStringAsync();
            var createDojaangDto = JsonSerializer.Deserialize<CreateDojaangDto>(body,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (createDojaangDto == null)
            {
                var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequest);
                await badRequest.WriteAsJsonAsync(new { message = "Invalid request data" });
                return badRequest;
            }

            await _dojaangService.AddAsync(createDojaangDto);

            var response = req.CreateResponse(HttpStatusCode.Created);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(new { message = "Dojaang created successfully" });
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating dojaang");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
            return errorResponse;
        }
    }

    [Function("UpdateDojaang")]
    public async Task<HttpResponseData> UpdateDojaang(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "dojaangs/{id:int}")] HttpRequestData req,
        int id)
    {
        try
        {
            _logger.LogInformation("Updating dojaang with ID: {DojaangId}", id);

            var body = await req.ReadAsStringAsync();
            var updateDojaangDto = JsonSerializer.Deserialize<UpdateDojaangDto>(body,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (updateDojaangDto == null)
            {
                var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequest);
                await badRequest.WriteAsJsonAsync(new { message = "Invalid request data" });
                return badRequest;
            }

            await _dojaangService.UpdateAsync(updateDojaangDto);

            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(new { message = "Dojaang updated successfully" });
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating dojaang with ID: {DojaangId}", id);
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
            return errorResponse;
        }
    }

    [Function("GetDojaangStudents")]
    public async Task<HttpResponseData> GetDojaangStudents(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "dojaangs/{dojaangId:int}/students")] HttpRequestData req,
        int dojaangId)
    {
        try
        {
            _logger.LogInformation("Getting students for dojaang ID: {DojaangId}", dojaangId);

            var students = await _userService.GetStudentsByDojaangIdAsync(dojaangId);
            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(students);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting students for dojaang ID: {DojaangId}", dojaangId);
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
            return errorResponse;
        }
    }

    [Function("DojaangsOptions")]
    public async Task<HttpResponseData> DojaangsOptions(
        [HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = "dojaangs/{*route}")] HttpRequestData req)
    {
        _logger.LogInformation("CORS preflight request for Dojaangs endpoints");
        var response = CorsHelper.CreateCorsResponse(req);
        return response;
    }
}
