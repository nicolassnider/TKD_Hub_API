namespace TKDHubAPI.Application.DTOs.Dashboard;

public class DashboardRequestDto
{
    public string? LayoutId { get; set; }
    public string? UserRole { get; set; }
    public DateRangeDto? DateRange { get; set; }
    public Dictionary<string, object>? Filters { get; set; }
    public List<string>? WidgetIds { get; set; }
}

public class DashboardResponseDto
{
    public DashboardLayoutDto Layout { get; set; } = null!;
    public List<WidgetDto> Widgets { get; set; } = new();
    public DashboardMetadataDto Metadata { get; set; } = null!;
}

public class DashboardLayoutDto
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? UserRole { get; set; }
    public bool IsDefault { get; set; }
    public int UserId { get; set; }
    public List<WidgetDto> Widgets { get; set; } = new();
}

public class WidgetDto
{
    public string Id { get; set; } = null!;
    public string Type { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public WidgetPositionDto Position { get; set; } = null!;
    public Dictionary<string, object> Config { get; set; } = new();
    public object? Data { get; set; }
    public bool Loading { get; set; }
    public string? Error { get; set; }
}

public class WidgetPositionDto
{
    public int X { get; set; }
    public int Y { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
}

public class DateRangeDto
{
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
}

public class DashboardMetadataDto
{
    public DateTime LastUpdated { get; set; }
    public int TotalUsers { get; set; }
    public int TotalClasses { get; set; }
    public int TotalStudents { get; set; }
    public int TotalDojaangs { get; set; }
    public Dictionary<string, object> AdditionalData { get; set; } = new();
}

public class CreateWidgetDto
{
    public string DashboardId { get; set; } = null!;
    public string Type { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public WidgetPositionDto Position { get; set; } = null!;
    public Dictionary<string, object> Config { get; set; } = new();
}

public class UpdateWidgetDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public WidgetPositionDto? Position { get; set; }
    public Dictionary<string, object>? Config { get; set; }
}

public class UpdateWidgetPositionDto
{
    public WidgetPositionDto Position { get; set; } = null!;
}

public class CreateDashboardLayoutDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? UserRole { get; set; }
    public List<CreateWidgetDto> Widgets { get; set; } = new();
}

public class DashboardTemplateDto
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string UserRole { get; set; } = null!;
    public bool IsDefault { get; set; }
}
