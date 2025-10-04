namespace TKDHubAPI.Domain.Entities;

public class DashboardLayout
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = null!;

    [MaxLength(500)]
    public string? Description { get; set; }

    [MaxLength(50)]
    public string? UserRole { get; set; }

    public bool IsDefault { get; set; }

    public int UserId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<Widget> Widgets { get; set; } = new List<Widget>();
}

public class Widget
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [MaxLength(50)]
    public string Type { get; set; } = null!;

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = null!;

    [MaxLength(500)]
    public string? Description { get; set; }

    // Position properties
    public int X { get; set; }
    public int Y { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }

    // Configuration stored as JSON
    public string ConfigJson { get; set; } = "{}";

    // Foreign key
    public string DashboardLayoutId { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual DashboardLayout DashboardLayout { get; set; } = null!;
}

public class WidgetData
{
    public object Value { get; set; } = null!;
    public object? PreviousValue { get; set; }
    public string? Subtitle { get; set; }
    public string? Unit { get; set; }
    public List<object>? Items { get; set; }
    public string? Content { get; set; }
    public List<object>? Actions { get; set; }
    public double? Progress { get; set; }
    public object? Target { get; set; }
    public object? Current { get; set; }
    public string? TimeRemaining { get; set; }
}

public enum WidgetType
{
    Metric,
    Chart,
    List,
    Progress,
    Card,
    Table,
    Calendar
}
