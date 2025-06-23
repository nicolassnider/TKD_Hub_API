using TKDHubAPI.Application.DTOs.Dashboard;

namespace TKDHubAPI.WebAPI.Controllers;

/// <summary>
/// Controller responsible for handling dashboard-related operations for users with the Coach or Admin roles.
/// Provides endpoints to retrieve dashboard data based on user role and widget selection.
/// </summary>
[Authorize(Roles = "Coach,Admin")]
public class DashboardsController : BaseApiController
{
    private readonly IDashboardService _dashboardService;

    /// <summary>
    /// Initializes a new instance of the <see cref="DashboardsController"/> class with the specified logger and dashboard service.
    /// </summary>
    /// <param name="logger">The logger instance for logging operations.</param>
    /// <param name="dashboardService">The dashboard service for retrieving dashboard data.</param>
    public DashboardsController(ILogger<DashboardsController> logger, IDashboardService dashboardService) : base(logger)
    {
        _dashboardService = dashboardService;
    }

    /// <summary>
    /// Retrieves dashboard data based on the provided request, including user role and selected widgets.
    /// </summary>
    /// <param name="request">The dashboard request containing user role and widget selection.</param>
    /// <returns>
    /// An <see cref="ActionResult{DashboardResponse}"/> containing the requested dashboard data.
    /// </returns>
    [HttpPost]
    public async Task<ActionResult<DashboardResponse>> GetDashboard([FromBody] DashboardRequest request)
    {
        var dashboard = await _dashboardService.GetDashboardAsync(request);
        return Ok(dashboard);
    }
}
