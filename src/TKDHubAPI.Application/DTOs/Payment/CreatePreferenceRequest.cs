namespace TKDHubAPI.Application.DTOs.Payment;
public class CreatePreferenceRequest
{
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
    public string PayerEmail { get; set; } = string.Empty;
}

