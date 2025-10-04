using MediatR;
using TKDHubAPI.Application.DTOs.Dashboard;

namespace TKDHubAPI.Application.CQRS.Commands.Dashboard;

public record CreateDashboardLayoutCommand(DashboardLayoutDto Layout) : IRequest<DashboardLayoutDto>;
