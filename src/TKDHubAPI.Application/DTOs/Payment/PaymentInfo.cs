namespace TKDHubAPI.Application.DTOs.Payment;

public class PaymentInfo
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "ARS";
    public DateTime PaymentDate { get; set; }
    public DateTime DueDate { get; set; }
    public PaymentInfoStatus Status { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public string? TransactionId { get; set; }
    public string Description { get; set; } = string.Empty;
    public int? ClassId { get; set; }
    public string? ClassName { get; set; }
}

public enum PaymentInfoStatus
{
    Paid,
    Pending,
    Overdue,
    Cancelled
}

public enum PaymentMethod
{
    MercadoPago,
    Cash,
    Transfer,
    Other
}
