using MediatR;
using Microsoft.Extensions.Logging;
using TKDHubAPI.Application.DTOs.Dashboard;

namespace TKDHubAPI.Application.CQRS.Queries.Dashboard;

public class GetDefaultDashboardQueryHandler : IRequestHandler<GetDefaultDashboardQuery, DashboardLayoutDto?>
{
    private readonly IDashboardService _dashboardService;
    private readonly ILogger<GetDefaultDashboardQueryHandler> _logger;

    public GetDefaultDashboardQueryHandler(IDashboardService dashboardService, ILogger<GetDefaultDashboardQueryHandler> logger)
    {
        _dashboardService = dashboardService;
        _logger = logger;
    }

    public async Task<DashboardLayoutDto?> Handle(GetDefaultDashboardQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting default dashboard for role {UserRole}", request.UserRole);
        return await _dashboardService.GetDefaultLayoutAsync(request.UserRole);
    }
}
