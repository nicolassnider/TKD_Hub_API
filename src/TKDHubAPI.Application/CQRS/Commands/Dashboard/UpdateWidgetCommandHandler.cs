using MediatR;
using Microsoft.Extensions.Logging;
using TKDHubAPI.Application.DTOs.Dashboard;

namespace TKDHubAPI.Application.CQRS.Commands.Dashboard;

public class UpdateWidgetCommandHandler : IRequestHandler<UpdateWidgetCommand, WidgetDto>
{
    private readonly IDashboardService _dashboardService;
    private readonly ILogger<UpdateWidgetCommandHandler> _logger;

    public UpdateWidgetCommandHandler(IDashboardService dashboardService, ILogger<UpdateWidgetCommandHandler> logger)
    {
        _dashboardService = dashboardService;
        _logger = logger;
    }

    public async Task<WidgetDto> Handle(UpdateWidgetCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Updating widget: {WidgetId}", request.Id);
        return await _dashboardService.UpdateWidgetAsync(request.Id, request.Widget);
    }
}
