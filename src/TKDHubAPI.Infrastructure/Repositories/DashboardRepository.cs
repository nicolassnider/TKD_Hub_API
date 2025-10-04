namespace TKDHubAPI.Infrastructure.Repositories;

public class DashboardRepository : IDashboardRepository
{
    private readonly TkdHubDbContext _context;

    public DashboardRepository(TkdHubDbContext context)
    {
        _context = context;
    }

    public async Task<List<DashboardLayout>> GetUserLayoutsAsync(int userId)
    {
        return await _context
            .DashboardLayouts.Include(l => l.Widgets)
            .Where(l => l.UserId == userId)
            .OrderBy(l => l.Name)
            .ToListAsync();
    }

    public async Task<DashboardLayout?> GetDefaultLayoutAsync(string userRole)
    {
        return await _context
            .DashboardLayouts.Include(l => l.Widgets)
            .FirstOrDefaultAsync(l => l.UserRole == userRole && l.IsDefault);
    }

    public async Task<DashboardLayout> CreateLayoutAsync(DashboardLayout layout)
    {
        _context.DashboardLayouts.Add(layout);
        await _context.SaveChangesAsync();
        return layout;
    }

    public async Task<DashboardLayout> UpdateLayoutAsync(DashboardLayout layout)
    {
        _context.DashboardLayouts.Update(layout);
        await _context.SaveChangesAsync();
        return layout;
    }

    public async Task<bool> DeleteLayoutAsync(string id)
    {
        var layout = await _context.DashboardLayouts.FindAsync(id);
        if (layout == null)
            return false;

        _context.DashboardLayouts.Remove(layout);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<Widget> CreateWidgetAsync(Widget widget)
    {
        _context.Widgets.Add(widget);
        await _context.SaveChangesAsync();
        return widget;
    }

    public async Task<Widget> UpdateWidgetAsync(Widget widget)
    {
        _context.Widgets.Update(widget);
        await _context.SaveChangesAsync();
        return widget;
    }

    public async Task<bool> DeleteWidgetAsync(string id)
    {
        var widget = await _context.Widgets.FindAsync(id);
        if (widget == null)
            return false;

        _context.Widgets.Remove(widget);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateWidgetPositionAsync(
        string id,
        int x,
        int y,
        int width,
        int height
    )
    {
        var widget = await _context.Widgets.FindAsync(id);
        if (widget == null)
            return false;

        widget.X = x;
        widget.Y = y;
        widget.Width = width;
        widget.Height = height;
        widget.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }
}
