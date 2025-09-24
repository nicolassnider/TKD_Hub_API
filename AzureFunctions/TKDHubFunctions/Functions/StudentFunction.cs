using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using TKDHubAPI.Application.DTOs.User;
using TKDHubAPI.Application.Interfaces;

namespace TKDHubFunctions.Functions;

public class StudentFunction
{
    private readonly ILogger<StudentFunction> _logger;
    private readonly IStudentService _studentService;

    public StudentFunction(ILogger<StudentFunction> logger, IStudentService studentService)
    {
        _logger = logger;
        _studentService = studentService;
    }

    [Function("GetAllStudents")]
    public async Task<HttpResponseData> GetAllStudents(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "students")] HttpRequestData req)
    {
        try
        {
            var result = await _studentService.GetAllStudentsAsync();
            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(result);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetAllStudents function");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
            return errorResponse;
        }
    }

    [Function("GetStudentById")]
    public async Task<HttpResponseData> GetStudentById(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "students/{id:int}")] HttpRequestData req,
        int id)
    {
        try
        {
            var result = await _studentService.GetStudentByIdAsync(id);
            
            if (result == null)
            {
                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                await notFoundResponse.WriteAsJsonAsync(new { message = "Student not found" });
                return notFoundResponse;
            }

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(result);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetStudentById function for ID: {Id}", id);
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
            return errorResponse;
        }
    }

    [Function("CreateStudent")]
    public async Task<HttpResponseData> CreateStudent(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "students")] HttpRequestData req)
    {
        try
        {
            var body = await req.ReadAsStringAsync();
            var createStudentDto = JsonSerializer.Deserialize<CreateStudentDto>(body, new JsonSerializerOptions 
            { 
                PropertyNameCaseInsensitive = true 
            });

            if (createStudentDto == null)
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                await badRequestResponse.WriteAsJsonAsync(new { message = "Invalid request data" });
                return badRequestResponse;
            }

            var result = await _studentService.CreateStudentAsync(createStudentDto);

            var response = req.CreateResponse(HttpStatusCode.Created);
            await response.WriteAsJsonAsync(result);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in CreateStudent function");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
            return errorResponse;
        }
    }

    [Function("GetStudentsByDojaang")]
    public async Task<HttpResponseData> GetStudentsByDojaang(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "dojaangs/{dojaangId:int}/students")] HttpRequestData req,
        int dojaangId)
    {
        try
        {
            var result = await _studentService.GetStudentsByDojaangIdAsync(dojaangId);

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(result);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetStudentsByDojaang function for DojaangId: {DojaangId}", dojaangId);
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
            return errorResponse;
        }
    }
}
