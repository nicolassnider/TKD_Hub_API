using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using TKDHubAPI.Application.DTOs.TrainingClass;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Application.Services;
using TKDHubAPI.Domain.Entities;
using TKDHubFunctions.Helpers;

namespace TKDHubFunctions.Functions
{
    public class ClassesFunction
    {
        private readonly ILogger<ClassesFunction> _logger;
        private readonly ITrainingClassService _trainingClassService;
        private readonly IStudentClassService _studentClassService;

        public ClassesFunction(ILogger<ClassesFunction> logger, ITrainingClassService trainingClassService, IStudentClassService studentClassService)
        {
            _logger = logger;
            _trainingClassService = trainingClassService;
            _studentClassService = studentClassService;
        }

        // GET api/Classes
        [Function("GetAllClasses")]
        public async Task<HttpResponseData> GetAllClasses(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "api/Classes")] HttpRequestData req)
        {
            try
            {
                _logger.LogInformation("Getting all training classes");
                
                var classes = await _trainingClassService.GetAllAsync();
                var response = req.CreateResponse(HttpStatusCode.OK);
                CorsHelper.SetCorsHeaders(response);
                await response.WriteAsJsonAsync(classes);
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAllClasses function");
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                CorsHelper.SetCorsHeaders(errorResponse);
                await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
                return errorResponse;
            }
        }

        // GET api/Classes/{id}
        [Function("GetClassById")]
        public async Task<HttpResponseData> GetClassById(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "api/Classes/{id:int}")] HttpRequestData req,
            int id)
        {
            try
            {
                _logger.LogInformation("Getting training class with ID: {ClassId}", id);
                
                var trainingClass = await _trainingClassService.GetByIdAsync(id);
                if (trainingClass == null)
                {
                    var notFound = req.CreateResponse(HttpStatusCode.NotFound);
                    CorsHelper.SetCorsHeaders(notFound);
                    await notFound.WriteAsJsonAsync(new { message = "Training class not found" });
                    return notFound;
                }

                var response = req.CreateResponse(HttpStatusCode.OK);
                CorsHelper.SetCorsHeaders(response);
                await response.WriteAsJsonAsync(trainingClass);
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetClassById function for ClassId: {ClassId}", id);
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                CorsHelper.SetCorsHeaders(errorResponse);
                await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
                return errorResponse;
            }
        }

        // POST api/Classes
        [Function("CreateClass")]
        public async Task<HttpResponseData> CreateClass(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "api/Classes")] HttpRequestData req)
        {
            try
            {
                _logger.LogInformation("Creating new training class");
                
                var body = await req.ReadAsStringAsync();
                var createClassDto = JsonSerializer.Deserialize<CreateTrainingClassDto>(body, 
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if (createClassDto == null)
                {
                    var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                    CorsHelper.SetCorsHeaders(badRequest);
                    await badRequest.WriteAsJsonAsync(new { message = "Invalid request data" });
                    return badRequest;
                }

                // Create TrainingClass entity from DTO
                var trainingClass = new TKDHubAPI.Domain.Entities.TrainingClass
                {
                    Name = createClassDto.Name,
                    DojaangId = createClassDto.DojaangId,
                    CoachId = createClassDto.CoachId
                };

                var result = await _trainingClassService.CreateAsync(trainingClass);
                
                var response = req.CreateResponse(HttpStatusCode.Created);
                CorsHelper.SetCorsHeaders(response);
                await response.WriteAsJsonAsync(result);
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating training class");
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                CorsHelper.SetCorsHeaders(errorResponse);
                await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
                return errorResponse;
            }
        }

        // GET api/classes/{classId}/students
        [Function("GetClassStudents")]
        public async Task<HttpResponseData> GetClassStudents(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "api/classes/{classId:int}/students")] HttpRequestData req,
            int classId)
        {
            try
            {
                _logger.LogInformation("Getting students for class ID: {ClassId}", classId);
                
                var students = await _studentClassService.GetStudentsByTrainingClassIdAsync(classId);
                var response = req.CreateResponse(HttpStatusCode.OK);
                CorsHelper.SetCorsHeaders(response);
                await response.WriteAsJsonAsync(students);
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetClassStudents function for ClassId: {ClassId}", classId);
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                CorsHelper.SetCorsHeaders(errorResponse);
                await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
                return errorResponse;
            }
        }

        // OPTIONS handlers for CORS preflight requests
        [Function("ClassesOptions")]
        public HttpResponseData ClassesOptions(
            [HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = "api/Classes")] HttpRequestData req)
        {
            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            return response;
        }

        [Function("ClassesByIdOptions")]
        public HttpResponseData ClassesByIdOptions(
            [HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = "api/Classes/{id:int}")] HttpRequestData req)
        {
            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            return response;
        }

        [Function("ClassStudentsOptions")]
        public HttpResponseData ClassStudentsOptions(
            [HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = "api/classes/{classId:int}/students")] HttpRequestData req)
        {
            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            return response;
        }
    }
}
