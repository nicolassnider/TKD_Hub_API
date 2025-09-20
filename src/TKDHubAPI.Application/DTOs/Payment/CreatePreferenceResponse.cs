namespace TKDHubAPI.Application.DTOs.Payment;

public class CreatePreferenceResponse
{
    public bool Success { get; set; }
    public string? PaymentUrl { get; set; }
    public string? ErrorMessage { get; set; }

    // Enhanced properties for MercadoPago integration
    public string? Id { get; set; }
    public string? InitPoint { get; set; }
    public string? SandboxInitPoint { get; set; }
    public DateTime? DateCreated { get; set; }
    public string? ExternalReference { get; set; }
}
