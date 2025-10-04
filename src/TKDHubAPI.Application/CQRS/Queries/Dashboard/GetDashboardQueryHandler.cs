using MediatR;
using Microsoft.Extensions.Logging;
using TKDHubAPI.Application.DTOs.Dashboard;

namespace TKDHubAPI.Application.CQRS.Queries.Dashboard;

public class GetDashboardQueryHandler : IRequestHandler<GetDashboardQuery, DashboardResponseDto>
{
    private readonly IDashboardService _dashboardService;
    private readonly ILogger<GetDashboardQueryHandler> _logger;

    public GetDashboardQueryHandler(
        IDashboardService dashboardService,
        ILogger<GetDashboardQueryHandler> logger
    )
    {
        _dashboardService = dashboardService;
        _logger = logger;
    }

    public async Task<DashboardResponseDto> Handle(
        GetDashboardQuery request,
        CancellationToken cancellationToken
    )
    {
        _logger.LogInformation(
            "Getting dashboard for user {UserId} with role {UserRole}",
            request.UserId,
            request.UserRole
        );
        return await _dashboardService.GetDashboardAsync(request.UserId, request.UserRole);
    }
}
