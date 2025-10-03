using TKDHubAPI.Application.DTOs.Pagination;

namespace TKDHubAPI.WebAPI.Controllers;

/// <summary>
/// Serves as the base class for all API controllers, providing common functionality such as standardized success and error responses,
/// and utilities for accessing the current user's roles.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    /// <summary>
    /// The logger instance for logging within derived controllers.
    /// </summary>
    protected readonly ILogger Logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="BaseApiController"/> class with the specified logger.
    /// </summary>
    /// <param name="logger">The logger to be used for logging operations.</param>
    protected BaseApiController(ILogger logger)
    {
        Logger = logger;
    }

    /// <summary>
    /// Returns a standardized error response with the specified message and status code.
    /// </summary>
    /// <param name="message">The error message to include in the response.</param>
    /// <param name="statusCode">The HTTP status code to return (default is 400).</param>
    /// <returns>An <see cref="IActionResult"/> containing the error message and status code.</returns>
    protected IActionResult ErrorResponse(string message, int statusCode)
    {
        CustomErrorResponseMiddleware.SetErrorMessage(HttpContext, message);
        return StatusCode(statusCode);
    }

    /// <summary>
    /// Returns a standardized success response containing the specified result.
    /// </summary>
    /// <param name="result">The result object to include in the response.</param>
    /// <returns>An <see cref="IActionResult"/> containing the result data.</returns>
    protected IActionResult SuccessResponse(object result)
    {
        return Ok(new { data = result });
    }

    /// <summary>
    /// Retrieves the list of roles associated with the currently authenticated user.
    /// </summary>
    /// <returns>A list of role names for the current user, or an empty list if the user is not authenticated.</returns>
    protected List<string> GetCurrentUserRoles()
    {
        if (User?.Identity?.IsAuthenticated != true)
            return new List<string>();

        return User.Claims
            .Where(c => c.Type == System.Security.Claims.ClaimTypes.Role)
            .Select(c => c.Value)
            .ToList();
    }

    /// <summary>
    /// Adds pagination metadata headers to the response.
    /// </summary>
    /// <typeparam name="T">The type of items in the paginated result</typeparam>
    /// <param name="paginatedResult">The paginated result containing metadata</param>
    protected void AddPaginationHeaders<T>(PaginatedResult<T> paginatedResult)
    {
        var paginationMetadata = new
        {
            currentPage = paginatedResult.Page,
            totalPages = paginatedResult.TotalPages,
            pageSize = paginatedResult.PageSize,
            totalCount = paginatedResult.TotalCount,
            hasNext = paginatedResult.HasNextPage,
            hasPrevious = paginatedResult.HasPreviousPage,
            nextPage = paginatedResult.NextPage,
            previousPage = paginatedResult.PreviousPage
        };

        Response.Headers["X-Pagination"] = System.Text.Json.JsonSerializer.Serialize(paginationMetadata);
        
        // Individual headers for easier access
        Response.Headers["X-Current-Page"] = paginatedResult.Page.ToString();
        Response.Headers["X-Total-Pages"] = paginatedResult.TotalPages.ToString();
        Response.Headers["X-Page-Size"] = paginatedResult.PageSize.ToString();
        Response.Headers["X-Total-Count"] = paginatedResult.TotalCount.ToString();
        Response.Headers["X-Has-Next"] = paginatedResult.HasNextPage.ToString();
        Response.Headers["X-Has-Previous"] = paginatedResult.HasPreviousPage.ToString();
    }

    /// <summary>
    /// Creates an OK response with pagination headers.
    /// </summary>
    /// <typeparam name="T">The type of items in the paginated result</typeparam>
    /// <param name="paginatedResult">The paginated result</param>
    /// <returns>An OK result with pagination headers</returns>
    protected IActionResult OkWithPagination<T>(PaginatedResult<T> paginatedResult)
    {
        AddPaginationHeaders(paginatedResult);
        return Ok(paginatedResult);
    }
}
