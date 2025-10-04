using MediatR;
using TKDHubAPI.Application.DTOs.Dashboard;

namespace TKDHubAPI.Application.CQRS.Queries.Dashboard;

public record GetDashboardLayoutsQuery(int UserId) : IRequest<List<DashboardLayoutDto>>;
