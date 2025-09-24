using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using TKDHubAPI.Application.DTOs.Payment;
using TKDHubAPI.Application.Interfaces;
using TKDHubFunctions.Helpers;

namespace TKDHubFunctions.Functions;

public class PaymentFunction
{
    private readonly ILogger<PaymentFunction> _logger;
    private readonly IMercadoPagoService _mercadoPagoService;

    public PaymentFunction(ILogger<PaymentFunction> logger, IMercadoPagoService mercadoPagoService)
    {
        _logger = logger;
        _mercadoPagoService = mercadoPagoService;
    }

    [Function("CreatePaymentPreference")]
    public async Task<HttpResponseData> CreatePaymentPreference(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "api/payments/create-preference")] HttpRequestData req)
    {
        try
        {
            _logger.LogInformation("Creating MercadoPago payment preference");
            
            var body = await req.ReadAsStringAsync();
            var request = JsonSerializer.Deserialize<CreatePreferenceRequest>(body, 
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (request == null || request.Amount <= 0 || 
                string.IsNullOrWhiteSpace(request.Description) || 
                string.IsNullOrWhiteSpace(request.PayerEmail))
            {
                var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequest);
                await badRequest.WriteAsJsonAsync(new { message = "Invalid request. Amount must be greater than 0, and Description and PayerEmail are required." });
                return badRequest;
            }

            var result = await _mercadoPagoService.CreatePreferenceAsync(
                request.Amount, 
                request.Description, 
                request.PayerEmail, 
                System.Threading.CancellationToken.None);

            if (result == null)
            {
                var serverError = req.CreateResponse(HttpStatusCode.InternalServerError);
                CorsHelper.SetCorsHeaders(serverError);
                await serverError.WriteAsJsonAsync(new { message = "Unexpected error while creating payment preference." });
                return serverError;
            }

            if (!result.Success)
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(new { Error = result.ErrorMessage });
                return badRequestResponse;
            }

            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(new { PaymentUrl = result.PaymentUrl });
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating payment preference");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
            return errorResponse;
        }
    }

    [Function("PaymentWebhook")]
    public async Task<HttpResponseData> PaymentWebhook(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "api/payments/webhook")] HttpRequestData req)
    {
        try
        {
            _logger.LogInformation("Processing MercadoPago webhook");
            
            var body = await req.ReadAsStringAsync();
            var webhook = JsonSerializer.Deserialize<object>(body, 
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            // Process the webhook (implement based on MercadoPago webhook structure)
            _logger.LogInformation("Webhook received: {WebhookData}", body);

            // For now, just acknowledge receipt
            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(new { status = "received" });
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing payment webhook");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Internal server error" });
            return errorResponse;
        }
    }

    [Function("PaymentsOptions")]
    public async Task<HttpResponseData> PaymentsOptions(
        [HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = "api/payments/{*route}")] HttpRequestData req)
    {
        _logger.LogInformation("CORS preflight request for Payments endpoints");
        var response = CorsHelper.CreateCorsResponse(req);
        return response;
    }
}
