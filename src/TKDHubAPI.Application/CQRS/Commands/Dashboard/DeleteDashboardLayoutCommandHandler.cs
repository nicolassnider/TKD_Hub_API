using MediatR;
using Microsoft.Extensions.Logging;

namespace TKDHubAPI.Application.CQRS.Commands.Dashboard;

public class DeleteDashboardLayoutCommandHandler : IRequestHandler<DeleteDashboardLayoutCommand, bool>
{
    private readonly IDashboardService _dashboardService;
    private readonly ILogger<DeleteDashboardLayoutCommandHandler> _logger;

    public DeleteDashboardLayoutCommandHandler(IDashboardService dashboardService, ILogger<DeleteDashboardLayoutCommandHandler> logger)
    {
        _dashboardService = dashboardService;
        _logger = logger;
    }

    public async Task<bool> Handle(DeleteDashboardLayoutCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Deleting dashboard layout: {LayoutId}", request.Id);
        return await _dashboardService.DeleteLayoutAsync(request.Id);
    }
}
