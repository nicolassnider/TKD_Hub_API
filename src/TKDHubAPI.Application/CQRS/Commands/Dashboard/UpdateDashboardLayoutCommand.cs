using MediatR;
using TKDHubAPI.Application.DTOs.Dashboard;

namespace TKDHubAPI.Application.CQRS.Commands.Dashboard;

public record UpdateDashboardLayoutCommand(string Id, DashboardLayoutDto Layout) : IRequest<DashboardLayoutDto>;
