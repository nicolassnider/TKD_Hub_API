using MediatR;
using Microsoft.Extensions.Logging;

namespace TKDHubAPI.Application.CQRS.Commands.Dashboard;

public class UpdateWidgetPositionCommandHandler : IRequestHandler<UpdateWidgetPositionCommand, bool>
{
    private readonly IDashboardService _dashboardService;
    private readonly ILogger<UpdateWidgetPositionCommandHandler> _logger;

    public UpdateWidgetPositionCommandHandler(IDashboardService dashboardService, ILogger<UpdateWidgetPositionCommandHandler> logger)
    {
        _dashboardService = dashboardService;
        _logger = logger;
    }

    public async Task<bool> Handle(UpdateWidgetPositionCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Updating widget position: {WidgetId}", request.Id);
        return await _dashboardService.UpdateWidgetPositionAsync(request.Id, request.X, request.Y, request.Width, request.Height);
    }
}
