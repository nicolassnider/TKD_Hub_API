using Microsoft.AspNetCore.Mvc;
using TKDHubAPI.Application.DTOs.User;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.WebAPI.Controllers;
using TKDHubAPI.WebAPI.Middlewares;

/// <summary>
/// API controller for authentication operations such as user login.
/// </summary>
public partial class AuthController : BaseApiController
{
    private readonly IUserService _userService;

    /// <summary>
    /// Initializes a new instance of the <see cref="AuthController"/> class.
    /// </summary>
    /// <param name="userService">The user service instance.</param>
    /// <param name="logger">The logger instance.</param>
    public AuthController(IUserService userService, ILogger<AuthController> logger)
        : base(logger)
    {
        _userService = userService;
    }



    /// <summary>
    /// Authenticates a user and returns a JWT token and user information if successful.
    /// </summary>
    /// <param name="loginDto">The login credentials.</param>
    /// <returns>
    /// 200 OK with token and user info if successful; 401 Unauthorized if credentials are invalid.
    /// </returns>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        var (token, user) = await _userService.LoginAndGetTokenAsync(loginDto);
        if (token == null)
        {
            CustomErrorResponseMiddleware.SetErrorMessage(HttpContext, "Invalid credentials.");
            return Unauthorized();
        }

        return Ok(new { token, user });
    }
}
