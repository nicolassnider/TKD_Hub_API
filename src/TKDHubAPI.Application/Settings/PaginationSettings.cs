namespace TKDHubAPI.Application.Settings;

public class PaginationSettings
{
    public int DefaultPageSize { get; set; }
    public int MaxPageSize { get; set; }
    public PatternSettings Pattern { get; set; } = new();
}
