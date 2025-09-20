using TKDHubAPI.Application.DTOs.Payment;

namespace TKDHubAPI.Application.Interfaces;

public interface IMercadoPagoWebhookService
{
    Task<bool> ProcessWebhookAsync(
        WebhookRequest webhookRequest,
        string signature,
        CancellationToken cancellationToken = default);
}
