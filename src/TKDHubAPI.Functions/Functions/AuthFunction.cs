using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;
using TKDHubAPI.Application.DTOs.User;
using TKDHubAPI.Application.Interfaces;
using TKDHubFunctions.Helpers;

namespace TKDHubFunctions.Functions;

public class AuthFunction
{
    private readonly ILogger<AuthFunction> _logger;
    private readonly IUserService _userService;

    public AuthFunction(ILogger<AuthFunction> logger, IUserService userService)
    {
        _logger = logger;
        _userService = userService;
    }

    [Function("Register")]
    public async Task<HttpResponseData> Register(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "register")] HttpRequestData req)
    {
        try
        {
            var body = await req.ReadAsStringAsync();
            var registerDto = JsonSerializer.Deserialize<RegisterDto>(body, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (registerDto == null)
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                await badRequestResponse.WriteAsJsonAsync(new { message = "Invalid request data" });
                return badRequestResponse;
            }

            var createUserDto = new CreateUserDto
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email,
                Password = registerDto.Password,
                PhoneNumber = registerDto.PhoneNumber ?? string.Empty,
                DateOfBirth = registerDto.DateOfBirth,
                DojaangId = registerDto.DojaangId,
                RoleIds = new List<int> { 4 } // Student role ID
            };

            var result = await _userService.RegisterAsync(createUserDto, registerDto.Password);

            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(result);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in Register function");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
            return errorResponse;
        }
    }

    [Function("Login")]
    public async Task<HttpResponseData> Login(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "login")] HttpRequestData req)
    {
        try
        {
            var body = await req.ReadAsStringAsync();
            var loginDto = JsonSerializer.Deserialize<LoginDto>(body, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (loginDto == null)
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                await badRequestResponse.WriteAsJsonAsync(new { message = "Invalid request data" });
                return badRequestResponse;
            }

            var result = await _userService.LoginAndGetTokenAsync(loginDto);

            if (result.Token == null)
            {
                var unauthorizedResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
                await unauthorizedResponse.WriteAsJsonAsync(new { message = "Invalid credentials" });
                return unauthorizedResponse;
            }

            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(new { token = result.Token, user = result.User });
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in Login function");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
            return errorResponse;
        }
    }

    [Function("LoginOptions")]
    public async Task<HttpResponseData> LoginOptions(
        [HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = "login")] HttpRequestData req)
    {
        _logger.LogInformation("CORS preflight request for login endpoint");
        var response = CorsHelper.CreateCorsResponse(req);
        return response;
    }

    [Function("RegisterOptions")]
    public async Task<HttpResponseData> RegisterOptions(
        [HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = "register")] HttpRequestData req)
    {
        _logger.LogInformation("CORS preflight request for register endpoint");
        var response = CorsHelper.CreateCorsResponse(req);
        return response;
    }
}
