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
using TKDHubAPI.Application.Common;

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
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "auth/register")] HttpRequestData req)
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
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "api/Auth/login")] HttpRequestData req)
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
}
