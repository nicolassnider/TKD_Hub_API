namespace TKDHubAPI.Application.Settings;
public class CorsSettings
{
    public string[] AllowedOrigins { get; set; } = [];

    /// <summary>
    /// When true, allow credentialed requests (cookies). Must be used with specific origins (not '*').
    /// </summary>
    public bool AllowCredentials { get; set; } = false;
}
