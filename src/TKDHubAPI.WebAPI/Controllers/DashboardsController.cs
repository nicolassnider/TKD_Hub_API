using TKDHubAPI.Application.DTOs.Dashboard;

namespace TKDHubAPI.WebAPI.Controllers;

//[Authorize(Roles = "Coach,Admin")]
public class DashboardsController : BaseApiController
{
    private readonly IDashboardService _dashboardService;

    public DashboardsController(ILogger<DashboardsController> logger, IDashboardService dashboardService) : base(logger)
    {
        _dashboardService = dashboardService;
    }

    [HttpPost]
    public async Task<ActionResult<DashboardResponse>> GetDashboard([FromBody] DashboardRequest request)
    {
        var dashboard = await _dashboardService.GetDashboardAsync(request);
        return Ok(dashboard);
    }
}
