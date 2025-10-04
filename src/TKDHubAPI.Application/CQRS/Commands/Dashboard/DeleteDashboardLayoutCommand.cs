using MediatR;

namespace TKDHubAPI.Application.CQRS.Commands.Dashboard;

public record DeleteDashboardLayoutCommand(string Id) : IRequest<bool>;
