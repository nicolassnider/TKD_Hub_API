using MediatR;
using TKDHubAPI.Application.DTOs.Dashboard;

namespace TKDHubAPI.Application.CQRS.Queries.Dashboard;

public record GetDashboardQuery(
    int UserId,
    string? UserRole = null,
    string? LayoutId = null,
    string? StartDate = null,
    string? EndDate = null,
    string? Filters = null,
    string? WidgetIds = null
) : IRequest<DashboardResponseDto>;
