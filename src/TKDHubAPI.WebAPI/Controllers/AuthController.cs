using Microsoft.AspNetCore.Mvc;
using TKDHubAPI.Application.DTOs.User;
using TKDHubAPI.Application.Interfaces;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;

    public AuthController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        var (token, user) = await _userService.LoginAndGetTokenAsync(loginDto);
        if (token == null)
            return Unauthorized("Invalid credentials.");

        return Ok(new { token, user });
    }
}
