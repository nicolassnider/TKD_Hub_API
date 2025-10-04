using TKDHubAPI.Application.DTOs.Dashboard;

namespace TKDHubAPI.Application.Interfaces;

/// <summary>
/// Service interface for dashboard-related operations.
/// </summary>
public interface IDashboardService
{
    Task<DashboardResponseDto> GetDashboardAsync(int userId, string? userRole = null);
    Task<List<DashboardLayoutDto>> GetUserLayoutsAsync(int userId);
    Task<DashboardLayoutDto?> GetDefaultLayoutAsync(string userRole);
    Task<object?> GetWidgetDataAsync(string widgetType, string widgetId);

    Task<DashboardLayoutDto> CreateLayoutAsync(DashboardLayoutDto layout);
    Task<DashboardLayoutDto> UpdateLayoutAsync(string id, DashboardLayoutDto layout);
    Task<bool> DeleteLayoutAsync(string id);

    Task<WidgetDto> CreateWidgetAsync(WidgetDto widget);
    Task<WidgetDto> UpdateWidgetAsync(string id, WidgetDto widget);
    Task<bool> DeleteWidgetAsync(string id);
    Task<bool> UpdateWidgetPositionAsync(string id, int x, int y, int width, int height);
}
