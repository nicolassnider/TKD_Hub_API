namespace TKDHubAPI.Application.Interfaces;
using System.Threading;
using TKDHubAPI.Application.DTOs.Payment;

public interface IMercadoPagoService
{
    /// <summary>
    /// Creates a MercadoPago payment preference with enhanced options.
    /// </summary>
    Task<CreatePreferenceResponse> CreatePreferenceAsync(
        CreatePreferenceRequest request,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets payment details by payment ID.
    /// </summary>
    Task<PaymentDetailsResponse?> GetPaymentAsync(
        string paymentId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates a refund for a payment.
    /// </summary>
    Task<RefundResponse> CreateRefundAsync(
        CreateRefundRequest request,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Legacy method for backward compatibility.
    /// </summary>
    [Obsolete("Use CreatePreferenceAsync(CreatePreferenceRequest) instead")]
    Task<CreatePreferenceResponse> CreatePreferenceAsync(
        decimal amount,
        string description,
        string payerEmail,
        CancellationToken cancellationToken = default);
}
