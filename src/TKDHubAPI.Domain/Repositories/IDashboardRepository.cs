namespace TKDHubAPI.Domain.Repositories;

public interface IDashboardRepository
{
    Task<List<DashboardLayout>> GetUserLayoutsAsync(int userId);
    Task<DashboardLayout?> GetDefaultLayoutAsync(string userRole);
    Task<DashboardLayout> CreateLayoutAsync(DashboardLayout layout);
    Task<DashboardLayout> UpdateLayoutAsync(DashboardLayout layout);
    Task<bool> DeleteLayoutAsync(string id);

    Task<Widget> CreateWidgetAsync(Widget widget);
    Task<Widget> UpdateWidgetAsync(Widget widget);
    Task<bool> DeleteWidgetAsync(string id);
    Task<bool> UpdateWidgetPositionAsync(string id, int x, int y, int width, int height);
}
