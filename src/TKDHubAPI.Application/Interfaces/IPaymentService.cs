using TKDHubAPI.Application.DTOs.Payment;

namespace TKDHubAPI.Application.Interfaces;

public interface IPaymentService
{
    Task UpdatePaymentStatusAsync(
        UpdatePaymentStatusRequest request,
        CancellationToken cancellationToken = default);

    Task<PaymentInfo?> GetPaymentByExternalIdAsync(
        string externalPaymentId,
        CancellationToken cancellationToken = default);

    Task<PaymentInfo> CreatePaymentAsync(
        CreatePaymentRequest request,
        CancellationToken cancellationToken = default);
}

public class CreatePaymentRequest
{
    public string ExternalPaymentId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
    public string PayerEmail { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public PaymentStatus Status { get; set; }
    public Dictionary<string, object>? Metadata { get; set; }
}
