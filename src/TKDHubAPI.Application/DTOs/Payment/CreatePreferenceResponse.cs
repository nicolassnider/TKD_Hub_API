namespace TKDHubAPI.Application.DTOs.Payment;
public class CreatePreferenceResponse
{
    public bool Success { get; set; }
    public string? PaymentUrl { get; set; }
    public string? ErrorMessage { get; set; }
}
