namespace TKDHubAPI.Application.DTOs.Payment;

public class WebhookRequest
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string ApiVersion { get; set; } = string.Empty;
    public WebhookData? Data { get; set; }
    public DateTime DateCreated { get; set; }
    public string Body { get; set; } = string.Empty;
}

public class WebhookData
{
    public string Id { get; set; } = string.Empty;
}

public class PaymentDetailsResponse
{
    public string Id { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string StatusDetail { get; set; } = string.Empty;
    public decimal TransactionAmount { get; set; }
    public string CurrencyId { get; set; } = string.Empty;
    public DateTime? DateCreated { get; set; }
    public DateTime? DateLastUpdated { get; set; }
    public Dictionary<string, object>? Metadata { get; set; }
    public PaymentMethodInfo? PaymentMethod { get; set; }
    public PayerInfo? Payer { get; set; }
}

public class PaymentMethodInfo
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string IssuerName { get; set; } = string.Empty;
}

public class PayerInfo
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
}

public class UpdatePaymentStatusRequest
{
    public string ExternalPaymentId { get; set; } = string.Empty;
    public PaymentStatus Status { get; set; }
    public string StatusDetail { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; }
    public Dictionary<string, object>? Metadata { get; set; }
}

public enum PaymentStatus
{
    Unknown,
    Pending,
    Approved,
    Rejected,
    Cancelled,
    Refunded,
    ChargedBack
}
