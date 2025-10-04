using MediatR;
using Microsoft.Extensions.Logging;
using TKDHubAPI.Application.DTOs.Dashboard;

namespace TKDHubAPI.Application.CQRS.Commands.Dashboard;

public class CreateWidgetCommandHandler : IRequestHandler<CreateWidgetCommand, WidgetDto>
{
    private readonly IDashboardService _dashboardService;
    private readonly ILogger<CreateWidgetCommandHandler> _logger;

    public CreateWidgetCommandHandler(IDashboardService dashboardService, ILogger<CreateWidgetCommandHandler> logger)
    {
        _dashboardService = dashboardService;
        _logger = logger;
    }

    public async Task<WidgetDto> Handle(CreateWidgetCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Creating widget: {WidgetTitle}", request.Widget.Title);
        return await _dashboardService.CreateWidgetAsync(request.Widget);
    }
}
