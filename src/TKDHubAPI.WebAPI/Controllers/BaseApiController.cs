using Microsoft.AspNetCore.Mvc;

namespace TKDHubAPI.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseApiController : ControllerBase

{
    protected readonly ILogger Logger;

    protected BaseApiController(ILogger logger)
    {
        Logger = logger;
    }

    // Example: Standardized error response
    protected IActionResult ErrorResponse(string message, int statusCode = 400)
    {
        return StatusCode(statusCode, new { error = message });
    }

    // Example: Standardized success response
    protected IActionResult SuccessResponse(object result)
    {
        return Ok(new { data = result });
    }

    protected List<string> GetCurrentUserRoles()
    {
        if (User?.Identity?.IsAuthenticated != true)
            return new List<string>();

        return User.Claims
            .Where(c => c.Type == System.Security.Claims.ClaimTypes.Role)
            .Select(c => c.Value)
            .ToList();
    }
}
