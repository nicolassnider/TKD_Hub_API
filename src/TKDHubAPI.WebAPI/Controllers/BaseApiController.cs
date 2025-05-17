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
}