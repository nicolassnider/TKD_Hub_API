using MediatR;

namespace TKDHubAPI.Application.CQRS.Commands.Dashboard;

public record UpdateWidgetPositionCommand(string Id, int X, int Y, int Width, int Height) : IRequest<bool>;
