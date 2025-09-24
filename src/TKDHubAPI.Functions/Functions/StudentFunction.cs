using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;
using TKDHubAPI.Application.DTOs.User;
using TKDHubAPI.Application.Interfaces;
using TKDHubFunctions.Helpers;

namespace TKDHubFunctions.Functions
{
    public class StudentFunction
    {
        private readonly ILogger<StudentFunction> _logger;
        private readonly IStudentService _studentService;
        private readonly IUserService _userService;

        public StudentFunction(ILogger<StudentFunction> logger, IStudentService studentService, IUserService userService)
        {
            _logger = logger;
            _studentService = studentService;
            _userService = userService;
        }

        // GET api/Students
        [Function("GetAllStudents")]
        public async Task<HttpResponseData> GetAllStudents(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Students")] HttpRequestData req)
        {
            try
            {
                _logger.LogInformation("Getting all students");
                var students = await _studentService.GetAllStudentsAsync();

                var response = req.CreateResponse(HttpStatusCode.OK);
                CorsHelper.SetCorsHeaders(response);
                await response.WriteAsJsonAsync(students);
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAllStudents function");
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                CorsHelper.SetCorsHeaders(errorResponse);
                await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
                return errorResponse;
            }
        }

        // GET api/Students/{id}
        [Function("GetStudentById")]
        public async Task<HttpResponseData> GetStudentById(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Students/{id:int}")] HttpRequestData req,
            int id)
        {
            try
            {
                _logger.LogInformation("Getting student with ID: {StudentId}", id);
                var result = await _studentService.GetStudentByIdAsync(id);

                if (result == null)
                {
                    var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                    CorsHelper.SetCorsHeaders(notFoundResponse);
                    await notFoundResponse.WriteAsJsonAsync(new { message = "Student not found" });
                    return notFoundResponse;
                }

                var response = req.CreateResponse(HttpStatusCode.OK);
                CorsHelper.SetCorsHeaders(response);
                await response.WriteAsJsonAsync(result);
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetStudentById function for StudentId: {StudentId}", id);
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                CorsHelper.SetCorsHeaders(errorResponse);
                await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
                return errorResponse;
            }
        }

        // POST api/Students
        [Function("CreateStudent")]
        public async Task<HttpResponseData> CreateStudent(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "Students")] HttpRequestData req)
        {
            try
            {
                _logger.LogInformation("Creating new student");

                string requestBody = await req.ReadAsStringAsync();
                var createStudentDto = JsonSerializer.Deserialize<CreateStudentDto>(requestBody, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (createStudentDto == null)
                {
                    var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    CorsHelper.SetCorsHeaders(badRequestResponse);
                    await badRequestResponse.WriteAsJsonAsync(new { message = "Invalid student data" });
                    return badRequestResponse;
                }

                var result = await _studentService.CreateStudentAsync(createStudentDto);

                var response = req.CreateResponse(HttpStatusCode.Created);
                CorsHelper.SetCorsHeaders(response);
                await response.WriteAsJsonAsync(result);
                return response;
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid data provided for student creation");
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(new { message = ex.Message });
                return badRequestResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CreateStudent function");
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                CorsHelper.SetCorsHeaders(errorResponse);
                await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
                return errorResponse;
            }
        }

        // PUT api/Students/{id}
        [Function("UpdateStudent")]
        public async Task<HttpResponseData> UpdateStudent(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "Students/{id:int}")] HttpRequestData req,
            int id)
        {
            try
            {
                _logger.LogInformation("Updating student with ID: {StudentId}", id);

                string requestBody = await req.ReadAsStringAsync();
                var updateStudentDto = JsonSerializer.Deserialize<UpdateStudentDto>(requestBody, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (updateStudentDto == null)
                {
                    var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    CorsHelper.SetCorsHeaders(badRequestResponse);
                    await badRequestResponse.WriteAsJsonAsync(new { message = "Invalid student data" });
                    return badRequestResponse;
                }

                var result = await _studentService.UpdateStudentAsync(id, updateStudentDto);

                if (result == null)
                {
                    var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                    CorsHelper.SetCorsHeaders(notFoundResponse);
                    await notFoundResponse.WriteAsJsonAsync(new { message = "Student not found" });
                    return notFoundResponse;
                }

                var response = req.CreateResponse(HttpStatusCode.OK);
                CorsHelper.SetCorsHeaders(response);
                await response.WriteAsJsonAsync(result);
                return response;
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid data provided for student update. StudentId: {StudentId}", id);
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(new { message = ex.Message });
                return badRequestResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UpdateStudent function for StudentId: {StudentId}", id);
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                CorsHelper.SetCorsHeaders(errorResponse);
                await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
                return errorResponse;
            }
        }

        // DELETE api/Students/{id}
        [Function("DeleteStudent")]
        public async Task<HttpResponseData> DeleteStudent(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "Students/{id:int}")] HttpRequestData req,
            int id)
        {
            try
            {
                _logger.LogInformation("Deleting student with ID: {StudentId}", id);

                await _userService.DeleteAsync(id);

                var response = req.CreateResponse(HttpStatusCode.NoContent);
                CorsHelper.SetCorsHeaders(response);
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in DeleteStudent function for StudentId: {StudentId}", id);
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                CorsHelper.SetCorsHeaders(errorResponse);
                await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
                return errorResponse;
            }
        }

        // OPTIONS handler for CORS preflight requests
        [Function("StudentsOptions")]
        public HttpResponseData StudentsOptions(
            [HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = "Students")] HttpRequestData req)
        {
            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            return response;
        }

        [Function("StudentsByIdOptions")]
        public HttpResponseData StudentsByIdOptions(
            [HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = "Students/{id:int}")] HttpRequestData req)
        {
            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            return response;
        }
    }
}
