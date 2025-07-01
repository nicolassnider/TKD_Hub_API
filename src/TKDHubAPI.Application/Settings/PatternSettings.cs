namespace TKDHubAPI.Application.Settings;

public class PatternSettings
{
    public string Type { get; set; } = "Offset"; // e.g., "Offset", "Cursor"
    public bool AllowCustomPageSize { get; set; } = true;
}
