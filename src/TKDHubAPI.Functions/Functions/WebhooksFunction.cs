using System.Net;
using System.Text;
using System.Text.Json;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using TKDHubAPI.Application.DTOs.Payment;
using TKDHubAPI.Application.Interfaces;
using TKDHubFunctions.Helpers;

namespace TKDHubFunctions.Functions;

public class WebhooksFunction
{
    private readonly ILogger<WebhooksFunction> _logger;
    private readonly IMercadoPagoWebhookService _webhookService;

    public WebhooksFunction(
        ILogger<WebhooksFunction> logger,
        IMercadoPagoWebhookService webhookService
    )
    {
        _logger = logger;
        _webhookService = webhookService;
    }

    [Function("MercadoPagoWebhook")]
    public async Task<HttpResponseData> HandleMercadoPagoWebhook(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "webhooks/mercadopago")]
            HttpRequestData req
    )
    {
        try
        {
            _logger.LogInformation("Received MercadoPago webhook request");

            // Get the signature from headers
            var signature = req
                .Headers.Where(h =>
                    h.Key.Equals("x-signature", StringComparison.OrdinalIgnoreCase)
                    || h.Key.Equals("X-Signature", StringComparison.OrdinalIgnoreCase)
                )
                .FirstOrDefault()
                .Value?.FirstOrDefault();

            if (string.IsNullOrEmpty(signature))
            {
                _logger.LogWarning("Missing signature header in webhook request");
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(
                    new { message = "Missing signature header" }
                );
                return badRequestResponse;
            }

            // Read the raw body for signature verification and parsing
            var body = await req.ReadAsStringAsync();
            if (string.IsNullOrEmpty(body))
            {
                _logger.LogWarning("Empty body in webhook request");
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(new { message = "Empty request body" });
                return badRequestResponse;
            }

            // Try to deserialize the webhook request
            WebhookRequest? webhookRequest = null;
            try
            {
                webhookRequest = JsonSerializer.Deserialize<WebhookRequest>(
                    body,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                );
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Failed to deserialize webhook request body");
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(
                    new { message = "Invalid JSON in request body" }
                );
                return badRequestResponse;
            }

            if (webhookRequest == null)
            {
                _logger.LogWarning("Webhook request deserialized to null");
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(
                    new { message = "Invalid webhook request format" }
                );
                return badRequestResponse;
            }

            // Set the raw body for signature verification
            webhookRequest.Body = body;

            _logger.LogInformation(
                "Received MercadoPago webhook: {Type} for resource {ResourceId}",
                webhookRequest.Type,
                webhookRequest.Data?.Id
            );

            // Process the webhook
            var success = await _webhookService.ProcessWebhookAsync(
                webhookRequest,
                signature,
                CancellationToken.None
            );

            if (success)
            {
                _logger.LogInformation(
                    "Successfully processed webhook {WebhookId}",
                    webhookRequest.Id
                );
                var response = req.CreateResponse(HttpStatusCode.OK);
                CorsHelper.SetCorsHeaders(response);
                await response.WriteAsJsonAsync(new { status = "success" });
                return response;
            }
            else
            {
                _logger.LogWarning("Failed to process webhook {WebhookId}", webhookRequest.Id);
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(
                    new { message = "Failed to process webhook" }
                );
                return badRequestResponse;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing MercadoPago webhook");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
            return errorResponse;
        }
    }

    [Function("MercadoLibreWebhook")]
    public async Task<HttpResponseData> HandleMercadoLibreWebhook(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "webhooks/mercadolibre")]
            HttpRequestData req
    )
    {
        try
        {
            _logger.LogInformation("Received MercadoLibre webhook request");

            var body = await req.ReadAsStringAsync();
            if (string.IsNullOrEmpty(body))
            {
                _logger.LogWarning("Empty body in MercadoLibre webhook request");
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(new { message = "Empty request body" });
                return badRequestResponse;
            }

            // Try to deserialize the MercadoLibre webhook payload
            MercadoLibreWebhookDto? payload = null;
            try
            {
                payload = JsonSerializer.Deserialize<MercadoLibreWebhookDto>(
                    body,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                );
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Failed to deserialize MercadoLibre webhook request body");
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(
                    new { message = "Invalid JSON in request body" }
                );
                return badRequestResponse;
            }

            if (payload?.Data?.Id == null)
            {
                _logger.LogWarning("MercadoLibre webhook payload missing required data");
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(
                    new { message = "Invalid webhook payload format" }
                );
                return badRequestResponse;
            }

            _logger.LogInformation(
                "Processing MercadoLibre webhook for payment {PaymentId}",
                payload.Data.Id
            );

            // TODO: Implement SignalR hub notification for real-time updates
            // This would typically notify connected clients about the payment update
            // For now, we'll just log the event
            _logger.LogInformation(
                "MercadoLibre payment received notification: {PaymentId}",
                payload.Data.Id
            );

            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(
                new { status = "received", paymentId = payload.Data.Id }
            );
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing MercadoLibre webhook");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
            return errorResponse;
        }
    }

    [Function("WebhookHealth")]
    public HttpResponseData HealthCheck(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "webhooks/health")]
            HttpRequestData req
    )
    {
        _logger.LogInformation("Webhook health check requested");

        var response = req.CreateResponse(HttpStatusCode.OK);
        CorsHelper.SetCorsHeaders(response);
        response.WriteString(
            JsonSerializer.Serialize(
                new
                {
                    status = "healthy",
                    timestamp = DateTime.UtcNow,
                    service = "TKD Hub Webhooks",
                }
            )
        );
        return response;
    }

    [Function("WebhooksOptions")]
    public HttpResponseData WebhooksOptions(
        [HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = "webhooks/{*route}")]
            HttpRequestData req
    )
    {
        var response = req.CreateResponse(HttpStatusCode.NoContent);
        CorsHelper.SetCorsHeaders(response);
        return response;
    }
}

// DTO for MercadoLibre webhook payload
public class MercadoLibreWebhookDto
{
    public WebhookData? Data { get; set; }
}

public class WebhookData
{
    public string? Id { get; set; }
}
