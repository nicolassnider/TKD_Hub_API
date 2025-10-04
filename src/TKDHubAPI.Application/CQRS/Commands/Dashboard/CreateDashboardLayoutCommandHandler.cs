using MediatR;
using Microsoft.Extensions.Logging;
using TKDHubAPI.Application.DTOs.Dashboard;

namespace TKDHubAPI.Application.CQRS.Commands.Dashboard;

public class CreateDashboardLayoutCommandHandler : IRequestHandler<CreateDashboardLayoutCommand, DashboardLayoutDto>
{
    private readonly IDashboardService _dashboardService;
    private readonly ILogger<CreateDashboardLayoutCommandHandler> _logger;

    public CreateDashboardLayoutCommandHandler(IDashboardService dashboardService, ILogger<CreateDashboardLayoutCommandHandler> logger)
    {
        _dashboardService = dashboardService;
        _logger = logger;
    }

    public async Task<DashboardLayoutDto> Handle(CreateDashboardLayoutCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Creating dashboard layout: {LayoutName}", request.Layout.Name);
        return await _dashboardService.CreateLayoutAsync(request.Layout);
    }
}
