using MediatR;

namespace TKDHubAPI.Application.CQRS.Queries.Dashboard;

public record GetWidgetDataQuery(string WidgetType, string WidgetId) : IRequest<object?>;
