using MediatR;
using Microsoft.Extensions.Logging;

namespace TKDHubAPI.Application.CQRS.Commands.Dashboard;

public class DeleteWidgetCommandHandler : IRequestHandler<DeleteWidgetCommand, bool>
{
    private readonly IDashboardService _dashboardService;
    private readonly ILogger<DeleteWidgetCommandHandler> _logger;

    public DeleteWidgetCommandHandler(IDashboardService dashboardService, ILogger<DeleteWidgetCommandHandler> logger)
    {
        _dashboardService = dashboardService;
        _logger = logger;
    }

    public async Task<bool> Handle(DeleteWidgetCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Deleting widget: {WidgetId}", request.Id);
        return await _dashboardService.DeleteWidgetAsync(request.Id);
    }
}
