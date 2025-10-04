using MediatR;
using TKDHubAPI.Application.DTOs.Dashboard;

namespace TKDHubAPI.Application.CQRS.Commands.Dashboard;

public record UpdateWidgetCommand(string Id, WidgetDto Widget) : IRequest<WidgetDto>;
