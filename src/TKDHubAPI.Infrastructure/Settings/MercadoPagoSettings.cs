namespace TKDHubAPI.Infrastructure.Settings;
using System.ComponentModel.DataAnnotations;

public class MercadoPagoSettings
{
    [Required]
    public string PublicKey { get; set; } = string.Empty;

    [Required]
    public string AccessToken { get; set; } = string.Empty;

    /// <summary>
    /// Maximum number of attempts when calling MercadoPago APIs for transient failures.
    /// </summary>
    [Range(1, 10)]
    public int MaxRetries { get; set; } = 3;

    /// <summary>
    /// Initial delay (milliseconds) used for exponential backoff between retries.
    /// </summary>
    [Range(100, 60000)]
    public int InitialRetryDelayMs { get; set; } = 500;
}
