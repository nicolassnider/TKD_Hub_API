using TKDHubAPI.Application.DTOs.Dashboard;

namespace TKDHubAPI.Application.Interfaces;
/// <summary>
/// Service interface for dashboard-related operations.
/// </summary>
public interface IDashboardService
{
    /// <summary>
    /// Retrieves dashboard data based on the specified request.
    /// </summary>
    /// <param name="request">The dashboard request containing user role and widget selection.</param>
    /// <returns>A <see cref="DashboardResponse"/> containing the requested dashboard data.</returns>
    Task<DashboardResponse> GetDashboardAsync(DashboardRequest request);
}

