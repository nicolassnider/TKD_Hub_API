using System.Text;
using TKDHubAPI.Application.DTOs.Payment;

namespace TKDHubAPI.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WebhooksController : ControllerBase
{
    private readonly IMercadoPagoWebhookService _webhookService;
    private readonly ILogger<WebhooksController> _logger;

    public WebhooksController(
        IMercadoPagoWebhookService webhookService,
        ILogger<WebhooksController> logger)
    {
        _webhookService = webhookService;
        _logger = logger;
    }

    [HttpPost("mercadopago")]
    public async Task<IActionResult> HandleMercadoPagoWebhook(
        [FromBody] WebhookRequest webhookRequest,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Get the signature from headers
            var signature = Request.Headers["x-signature"].FirstOrDefault() ??
                           Request.Headers["X-Signature"].FirstOrDefault();

            if (string.IsNullOrEmpty(signature))
            {
                _logger.LogWarning("Missing signature header in webhook request");
                return BadRequest("Missing signature header");
            }

            // Read the raw body for signature verification
            var body = await ReadRequestBodyAsync();
            webhookRequest.Body = body;

            _logger.LogInformation("Received MercadoPago webhook: {Type} for resource {ResourceId}",
                webhookRequest.Type, webhookRequest.Data?.Id);

            // Process the webhook
            var success = await _webhookService.ProcessWebhookAsync(webhookRequest, signature, cancellationToken);

            if (success)
            {
                _logger.LogInformation("Successfully processed webhook {WebhookId}", webhookRequest.Id);
                return Ok();
            }
            else
            {
                _logger.LogWarning("Failed to process webhook {WebhookId}", webhookRequest.Id);
                return BadRequest("Failed to process webhook");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing MercadoPago webhook");
            return StatusCode(500, "Internal server error");
        }
    }

    private async Task<string> ReadRequestBodyAsync()
    {
        Request.Body.Position = 0;
        using var reader = new StreamReader(Request.Body, Encoding.UTF8);
        return await reader.ReadToEndAsync();
    }
}
