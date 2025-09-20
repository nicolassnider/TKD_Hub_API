namespace TKDHubAPI.Infrastructure.Settings;
using System.ComponentModel.DataAnnotations;

public class MercadoPagoSettings
{
    [Required]
    public string PublicKey { get; set; } = string.Empty;

    [Required]
    public string AccessToken { get; set; } = string.Empty;

    [Required]
    [Url]
    public string BaseUrl { get; set; } = "https://api.mercadopago.com/";

    /// <summary>
    /// Maximum number of attempts when calling MercadoPago APIs for transient failures.
    /// </summary>
    [Range(1, 10)]
    public int MaxRetryAttempts { get; set; } = 3;

    /// <summary>
    /// Initial delay (milliseconds) used for exponential backoff between retries.
    /// </summary>
    [Range(100, 60000)]
    public int InitialRetryDelayMs { get; set; } = 500;

    /// <summary>
    /// HTTP request timeout in seconds.
    /// </summary>
    [Range(5, 300)]
    public int TimeoutSeconds { get; set; } = 30;

    /// <summary>
    /// Webhook secret for signature verification.
    /// </summary>
    [Required]
    public string WebhookSecret { get; set; } = string.Empty;

    /// <summary>
    /// Webhook URL for MercadoPago notifications.
    /// </summary>
    [Required]
    [Url]
    public string WebhookUrl { get; set; } = string.Empty;

    /// <summary>
    /// Default success URL for payment redirects.
    /// </summary>
    [Url]
    public string DefaultSuccessUrl { get; set; } = string.Empty;

    /// <summary>
    /// Default failure URL for payment redirects.
    /// </summary>
    [Url]
    public string DefaultFailureUrl { get; set; } = string.Empty;

    /// <summary>
    /// Default pending URL for payment redirects.
    /// </summary>
    [Url]
    public string DefaultPendingUrl { get; set; } = string.Empty;

    /// <summary>
    /// Enable sandbox mode for testing.
    /// </summary>
    public bool IsSandbox { get; set; } = true;

    /// <summary>
    /// Cache payment preferences for this duration (in minutes).
    /// </summary>
    [Range(1, 1440)]
    public int PreferenceCacheMinutes { get; set; } = 60;

    /// <summary>
    /// Enable detailed logging for debugging.
    /// </summary>
    public bool EnableDetailedLogging { get; set; } = false;
}
