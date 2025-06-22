namespace TKDHubAPI.Application.Interfaces;
public interface IMercadoPagoService
{
    Task<string> CreatePreferenceAsync(decimal amount, string description, string payerEmail);
    // Add more methods as needed, e.g., GetPaymentStatusAsync, etc.
}
