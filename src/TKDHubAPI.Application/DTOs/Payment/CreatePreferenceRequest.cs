namespace TKDHubAPI.Application.DTOs.Payment;

using System.ComponentModel.DataAnnotations;

[ExcludeFromCodeCoverage]
public class CreatePreferenceRequest
{
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than zero")]
    public decimal TransactionAmount { get; set; }

    [Required]
    [StringLength(256, MinimumLength = 1)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string PayerEmail { get; set; } = string.Empty;

    [StringLength(100)]
    public string? PayerName { get; set; }

    [StringLength(100)]
    public string? PayerSurname { get; set; }

    [StringLength(3)]
    public string CurrencyId { get; set; } = "ARS";

    [StringLength(256)]
    public string? ExternalReference { get; set; }

    public DateTime? ExpirationDate { get; set; }

    public BackUrlsInfo? BackUrls { get; set; }

    public Dictionary<string, object>? Metadata { get; set; }

    // Backward compatibility
    [Obsolete("Use TransactionAmount instead")]
    public decimal Amount
    {
        get => TransactionAmount;
        set => TransactionAmount = value;
    }
}

public class BackUrlsInfo
{
    [Url]
    public string? Success { get; set; }

    [Url]
    public string? Failure { get; set; }

    [Url]
    public string? Pending { get; set; }
}
