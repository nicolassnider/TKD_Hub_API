namespace TKDHubAPI.Application.DTOs.Payment;

public class CreateRefundRequest
{
    public string PaymentId { get; set; } = string.Empty;
    public decimal? Amount { get; set; } // If null, full refund
    public string? Reason { get; set; }
}

public class RefundResponse
{
    public string Id { get; set; } = string.Empty;
    public string PaymentId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime DateCreated { get; set; }
    public string Reason { get; set; } = string.Empty;
}
