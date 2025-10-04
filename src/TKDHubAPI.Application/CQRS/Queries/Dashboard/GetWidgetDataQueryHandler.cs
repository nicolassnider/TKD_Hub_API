using MediatR;
using Microsoft.Extensions.Logging;

namespace TKDHubAPI.Application.CQRS.Queries.Dashboard;

public class GetWidgetDataQueryHandler : IRequestHandler<GetWidgetDataQuery, object?>
{
    private readonly IDashboardService _dashboardService;
    private readonly ILogger<GetWidgetDataQueryHandler> _logger;

    public GetWidgetDataQueryHandler(IDashboardService dashboardService, ILogger<GetWidgetDataQueryHandler> logger)
    {
        _dashboardService = dashboardService;
        _logger = logger;
    }

    public async Task<object?> Handle(GetWidgetDataQuery request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting widget data for widget {WidgetId} of type {WidgetType}", request.WidgetId, request.WidgetType);
        return await _dashboardService.GetWidgetDataAsync(request.WidgetType, request.WidgetId);
    }
}
