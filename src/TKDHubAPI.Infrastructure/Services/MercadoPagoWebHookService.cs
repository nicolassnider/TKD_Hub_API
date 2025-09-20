using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;
using System.Text;
using TKDHubAPI.Application.DTOs.Payment;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Infrastructure.Settings;

namespace TKDHubAPI.Infrastructure.Services;

public class MercadoPagoWebhookService : IMercadoPagoWebhookService
{
    private readonly ILogger<MercadoPagoWebhookService> _logger;
    private readonly MercadoPagoSettings _settings;
    private readonly IPaymentService _paymentService;

    public MercadoPagoWebhookService(
        ILogger<MercadoPagoWebhookService> logger,
        IOptions<MercadoPagoSettings> settings,
        IPaymentService paymentService)
    {
        _logger = logger;
        _settings = settings.Value;
        _paymentService = paymentService;
    }

    public async Task<bool> ProcessWebhookAsync(
        WebhookRequest webhookRequest,
        string signature,
        CancellationToken cancellationToken = default)
    {
        using var scope = _logger.BeginScope("ProcessWebhook-{WebhookId}", webhookRequest.Id);

        try
        {
            // Verify webhook signature
            if (!VerifySignature(webhookRequest.Body, signature))
            {
                _logger.LogWarning("Invalid webhook signature for webhook {WebhookId}", webhookRequest.Id);
                return false;
            }

            _logger.LogInformation("Processing webhook {WebhookId} of type {Type} for resource {Resource}",
                webhookRequest.Id, webhookRequest.Type, webhookRequest.Data?.Id);

            // Handle different webhook types
            switch (webhookRequest.Type)
            {
                case "payment":
                    await HandlePaymentWebhookAsync(webhookRequest.Data, cancellationToken);
                    break;

                case "merchant_order":
                    await HandleMerchantOrderWebhookAsync(webhookRequest.Data, cancellationToken);
                    break;

                case "plan":
                case "subscription":
                    await HandleSubscriptionWebhookAsync(webhookRequest.Data, cancellationToken);
                    break;

                default:
                    _logger.LogInformation("Unhandled webhook type: {Type}", webhookRequest.Type);
                    break;
            }

            _logger.LogInformation("Successfully processed webhook {WebhookId}", webhookRequest.Id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing webhook {WebhookId}", webhookRequest.Id);
            return false;
        }
    }

    private bool VerifySignature(string payload, string signature)
    {
        try
        {
            // Extract timestamp and signature from header
            var parts = signature.Split(',');
            var timestamp = parts.FirstOrDefault(p => p.StartsWith("ts="))?.Substring(3);
            var v1 = parts.FirstOrDefault(p => p.StartsWith("v1="))?.Substring(3);

            if (string.IsNullOrEmpty(timestamp) || string.IsNullOrEmpty(v1))
            {
                _logger.LogWarning("Invalid signature format");
                return false;
            }

            // Check timestamp (webhook should not be older than 5 minutes)
            if (DateTimeOffset.FromUnixTimeSeconds(long.Parse(timestamp))
                .AddMinutes(5) < DateTimeOffset.UtcNow)
            {
                _logger.LogWarning("Webhook timestamp is too old");
                return false;
            }

            // Verify signature
            var manifestString = $"id:{_settings.WebhookSecret};request-url:{_settings.WebhookUrl};ts:{timestamp}";
            var signatureBytes = ComputeHmacSha256(manifestString, _settings.WebhookSecret);
            var expectedSignature = Convert.ToHexString(signatureBytes).ToLower();

            var isValid = v1.Equals(expectedSignature, StringComparison.OrdinalIgnoreCase);

            if (!isValid)
            {
                _logger.LogWarning("Signature verification failed. Expected: {Expected}, Actual: {Actual}",
                    expectedSignature, v1);
            }

            return isValid;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying webhook signature");
            return false;
        }
    }

    private async Task HandlePaymentWebhookAsync(WebhookData? data, CancellationToken cancellationToken)
    {
        if (data?.Id == null)
        {
            _logger.LogWarning("Payment webhook data is null or missing ID");
            return;
        }

        try
        {
            // Get payment details from MercadoPago
            var paymentDetails = await GetPaymentDetailsAsync(data.Id, cancellationToken);

            if (paymentDetails == null)
            {
                _logger.LogWarning("Could not retrieve payment details for payment {PaymentId}", data.Id);
                return;
            }

            // Update payment status in our system
            await _paymentService.UpdatePaymentStatusAsync(new UpdatePaymentStatusRequest
            {
                ExternalPaymentId = data.Id,
                Status = MapPaymentStatus(paymentDetails.Status),
                StatusDetail = paymentDetails.StatusDetail,
                UpdatedAt = paymentDetails.DateLastUpdated ?? DateTime.UtcNow,
                Metadata = paymentDetails.Metadata
            }, cancellationToken);

            _logger.LogInformation("Updated payment {PaymentId} status to {Status}",
                data.Id, paymentDetails.Status);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error handling payment webhook for payment {PaymentId}", data.Id);
            throw;
        }
    }

    private async Task HandleMerchantOrderWebhookAsync(WebhookData? data, CancellationToken cancellationToken)
    {
        if (data?.Id == null) return;

        _logger.LogInformation("Processing merchant order webhook for order {OrderId}", data.Id);

        // Handle merchant order updates
        // This could involve updating order status, processing refunds, etc.
        await Task.CompletedTask; // Placeholder for actual implementation
    }

    private async Task HandleSubscriptionWebhookAsync(WebhookData? data, CancellationToken cancellationToken)
    {
        if (data?.Id == null) return;

        _logger.LogInformation("Processing subscription webhook for subscription {SubscriptionId}", data.Id);

        // Handle subscription events
        // This could involve updating subscription status, processing renewals, etc.
        await Task.CompletedTask; // Placeholder for actual implementation
    }

    private async Task<PaymentDetailsResponse?> GetPaymentDetailsAsync(string paymentId, CancellationToken cancellationToken)
    {
        // This would call MercadoPago API to get payment details
        // Implementation depends on your MercadoPago service
        // For now, return null to demonstrate the pattern
        _logger.LogInformation("Getting payment details for payment {PaymentId}", paymentId);
        await Task.CompletedTask; // Placeholder for actual implementation
        return null;
    }

    private static byte[] ComputeHmacSha256(string message, string secret)
    {
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
        return hmac.ComputeHash(Encoding.UTF8.GetBytes(message));
    }

    private static PaymentStatus MapPaymentStatus(string mercadoPagoStatus)
    {
        return mercadoPagoStatus?.ToLower() switch
        {
            "approved" => PaymentStatus.Approved,
            "pending" => PaymentStatus.Pending,
            "rejected" => PaymentStatus.Rejected,
            "cancelled" => PaymentStatus.Cancelled,
            "refunded" => PaymentStatus.Refunded,
            "charged_back" => PaymentStatus.ChargedBack,
            _ => PaymentStatus.Unknown
        };
    }
}
