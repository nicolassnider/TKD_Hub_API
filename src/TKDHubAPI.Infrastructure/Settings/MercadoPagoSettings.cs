namespace TKDHubAPI.Infrastructure.Settings;
using System.ComponentModel.DataAnnotations;

public class MercadoPagoSettings
{
    [Required]
    public string PublicKey { get; set; } = string.Empty;

    [Required]
    public string AccessToken { get; set; } = string.Empty;
}
