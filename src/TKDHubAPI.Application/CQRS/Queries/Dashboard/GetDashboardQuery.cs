using MediatR;
using TKDHubAPI.Application.DTOs.Dashboard;

namespace TKDHubAPI.Application.CQRS.Queries.Dashboard;

public record GetDashboardQuery(int UserId) : IRequest<DashboardResponseDto>;
