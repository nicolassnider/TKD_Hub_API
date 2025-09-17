namespace TKDHubAPI.Application.Interfaces;
using System.Threading;
using TKDHubAPI.Application.DTOs.Payment;

public interface IMercadoPagoService
{
    /// <summary>
    /// Creates a MercadoPago payment preference and returns a structured response with the payment URL or an error.
    /// </summary>
    Task<CreatePreferenceResponse> CreatePreferenceAsync(decimal amount, string description, string payerEmail, CancellationToken cancellationToken = default);
    // Add more methods as needed, e.g., GetPaymentStatusAsync, etc.
}
