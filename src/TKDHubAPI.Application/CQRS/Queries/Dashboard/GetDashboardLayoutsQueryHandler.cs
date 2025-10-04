using MediatR;
using Microsoft.Extensions.Logging;
using TKDHubAPI.Application.DTOs.Dashboard;

namespace TKDHubAPI.Application.CQRS.Queries.Dashboard;

public class GetDashboardLayoutsQueryHandler : IRequestHandler<GetDashboardLayoutsQuery, List<DashboardLayoutDto>>
{
    private readonly IDashboardService _dashboardService;
    private readonly ILogger<GetDashboardLayoutsQueryHandler> _logger;

    public GetDashboardLayoutsQueryHandler(IDashboardService dashboardService, ILogger<GetDashboardLayoutsQueryHandler> logger)
    {
        _dashboardService = dashboardService;
        _logger = logger;
    }

    public async Task<List<DashboardLayoutDto>> Handle(GetDashboardLayoutsQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting dashboard layouts for user {UserId}", request.UserId);
        return await _dashboardService.GetUserLayoutsAsync(request.UserId);
    }
}
