using MediatR;
using Microsoft.Extensions.Logging;
using TKDHubAPI.Application.DTOs.Dashboard;

namespace TKDHubAPI.Application.CQRS.Commands.Dashboard;

public class UpdateDashboardLayoutCommandHandler : IRequestHandler<UpdateDashboardLayoutCommand, DashboardLayoutDto>
{
    private readonly IDashboardService _dashboardService;
    private readonly ILogger<UpdateDashboardLayoutCommandHandler> _logger;

    public UpdateDashboardLayoutCommandHandler(IDashboardService dashboardService, ILogger<UpdateDashboardLayoutCommandHandler> logger)
    {
        _dashboardService = dashboardService;
        _logger = logger;
    }

    public async Task<DashboardLayoutDto> Handle(UpdateDashboardLayoutCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Updating dashboard layout: {LayoutId}", request.Id);
        return await _dashboardService.UpdateLayoutAsync(request.Id, request.Layout);
    }
}
