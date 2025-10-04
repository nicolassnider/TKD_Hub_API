using MediatR;

namespace TKDHubAPI.Application.CQRS.Commands.Dashboard;

public record DeleteWidgetCommand(string Id) : IRequest<bool>;
