using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net;
using System.Text;
using System.Text.Json;
using TKDHubAPI.Application.DTOs.Payment;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Infrastructure.Settings;

namespace TKDHubAPI.Infrastructure.Services;

public class EnhancedMercadoPagoService : IMercadoPagoService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<EnhancedMercadoPagoService> _logger;
    private readonly MercadoPagoSettings _settings;

    public EnhancedMercadoPagoService(
        HttpClient httpClient,
        ILogger<EnhancedMercadoPagoService> logger,
        IOptions<MercadoPagoSettings> settings)
    {
        _httpClient = httpClient;
        _logger = logger;
        _settings = settings.Value;
        ConfigureHttpClient();
    }

    // Legacy method for backward compatibility
    public async Task<CreatePreferenceResponse> CreatePreferenceAsync(
        decimal amount,
        string description,
        string payerEmail,
        CancellationToken cancellationToken = default)
    {
        var request = new CreatePreferenceRequest
        {
            TransactionAmount = amount,
            Description = description,
            PayerEmail = payerEmail
        };

        return await CreatePreferenceAsync(request, cancellationToken);
    }

    public async Task<CreatePreferenceResponse> CreatePreferenceAsync(
        CreatePreferenceRequest request,
        CancellationToken cancellationToken = default)
    {
        using var scope = _logger.BeginScope("CreatePreference-{RequestId}", Guid.NewGuid());

        try
        {
            // Validate request
            ValidateCreatePreferenceRequest(request);

            _logger.LogInformation("Creating MercadoPago preference for amount {Amount} {Currency}",
                request.TransactionAmount, request.CurrencyId);

            // Prepare request payload
            var payload = new
            {
                items = new[]
                {
                    new
                    {
                        title = request.Description,
                        quantity = 1,
                        unit_price = request.TransactionAmount,
                        currency_id = request.CurrencyId
                    }
                },
                payer = new
                {
                    email = request.PayerEmail,
                    name = request.PayerName ?? string.Empty,
                    surname = request.PayerSurname ?? string.Empty
                },
                back_urls = new
                {
                    success = request.BackUrls?.Success ?? _settings.DefaultSuccessUrl,
                    failure = request.BackUrls?.Failure ?? _settings.DefaultFailureUrl,
                    pending = request.BackUrls?.Pending ?? _settings.DefaultPendingUrl
                },
                auto_return = "approved",
                external_reference = request.ExternalReference,
                notification_url = _settings.WebhookUrl,
                expires = request.ExpirationDate.HasValue,
                expiration_date_from = request.ExpirationDate?.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                expiration_date_to = request.ExpirationDate?.AddHours(24).ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                metadata = request.Metadata ?? new Dictionary<string, object>()
            };

            var jsonContent = JsonSerializer.Serialize(payload, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
            });

            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            // Execute request with basic retry logic
            var response = await ExecuteWithRetryAsync(async () =>
            {
                return await _httpClient.PostAsync("checkout/preferences", content, cancellationToken);
            });

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogError("MercadoPago API error: {StatusCode} - {Content}",
                    response.StatusCode, errorContent);

                return new CreatePreferenceResponse
                {
                    Success = false,
                    ErrorMessage = $"MercadoPago API error: {response.StatusCode}"
                };
            }

            var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);
            var mercadoPagoResponse = JsonSerializer.Deserialize<MercadoPagoPreferenceResponse>(responseContent,
                new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower });

            if (mercadoPagoResponse == null)
            {
                throw new InvalidOperationException("Failed to deserialize MercadoPago response");
            }

            var result = new CreatePreferenceResponse
            {
                Success = true,
                PaymentUrl = mercadoPagoResponse.InitPoint,
                Id = mercadoPagoResponse.Id,
                InitPoint = mercadoPagoResponse.InitPoint,
                SandboxInitPoint = mercadoPagoResponse.SandboxInitPoint,
                DateCreated = mercadoPagoResponse.DateCreated,
                ExternalReference = request.ExternalReference
            };

            _logger.LogInformation("Successfully created MercadoPago preference {PreferenceId} with init point {InitPoint}",
                result.Id, result.InitPoint);

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating MercadoPago preference");
            return new CreatePreferenceResponse
            {
                Success = false,
                ErrorMessage = ex.Message
            };
        }
    }

    public async Task<PaymentDetailsResponse?> GetPaymentAsync(
        string paymentId,
        CancellationToken cancellationToken = default)
    {
        using var scope = _logger.BeginScope("GetPayment-{PaymentId}", paymentId);

        try
        {
            if (string.IsNullOrWhiteSpace(paymentId))
            {
                throw new ArgumentException("Payment ID cannot be null or empty", nameof(paymentId));
            }

            _logger.LogInformation("Retrieving payment details for payment {PaymentId}", paymentId);

            var response = await ExecuteWithRetryAsync(async () =>
            {
                return await _httpClient.GetAsync($"v1/payments/{paymentId}", cancellationToken);
            });

            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                _logger.LogWarning("Payment {PaymentId} not found", paymentId);
                return null;
            }

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogError("MercadoPago API error for payment {PaymentId}: {StatusCode} - {Content}",
                    paymentId, response.StatusCode, errorContent);
                return null;
            }

            var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);
            var paymentDetails = JsonSerializer.Deserialize<PaymentDetailsResponse>(responseContent,
                new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower });

            _logger.LogInformation("Successfully retrieved payment details for payment {PaymentId} with status {Status}",
                paymentId, paymentDetails?.Status);

            return paymentDetails;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving payment {PaymentId}", paymentId);
            return null;
        }
    }

    public async Task<RefundResponse> CreateRefundAsync(
        CreateRefundRequest request,
        CancellationToken cancellationToken = default)
    {
        using var scope = _logger.BeginScope("CreateRefund-{PaymentId}", request.PaymentId);

        try
        {
            ValidateRefundRequest(request);

            _logger.LogInformation("Creating refund for payment {PaymentId} with amount {Amount}",
                request.PaymentId, request.Amount);

            var payload = new
            {
                amount = request.Amount,
                reason = request.Reason ?? "Requested by customer"
            };

            var jsonContent = JsonSerializer.Serialize(payload, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
            });

            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await ExecuteWithRetryAsync(async () =>
            {
                return await _httpClient.PostAsync($"v1/payments/{request.PaymentId}/refunds", content, cancellationToken);
            });

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogError("MercadoPago refund API error: {StatusCode} - {Content}",
                    response.StatusCode, errorContent);
                throw new InvalidOperationException($"Failed to create refund: {response.StatusCode}");
            }

            var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);
            var refundResponse = JsonSerializer.Deserialize<RefundResponse>(responseContent,
                new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower });

            if (refundResponse == null)
            {
                throw new InvalidOperationException("Failed to deserialize MercadoPago refund response");
            }

            _logger.LogInformation("Successfully created refund {RefundId} for payment {PaymentId}",
                refundResponse.Id, request.PaymentId);

            return refundResponse;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating refund for payment {PaymentId}", request.PaymentId);
            throw;
        }
    }

    private async Task<HttpResponseMessage> ExecuteWithRetryAsync(Func<Task<HttpResponseMessage>> operation)
    {
        var maxAttempts = _settings.MaxRetryAttempts;
        var delay = _settings.InitialRetryDelayMs;

        for (int attempt = 1; attempt <= maxAttempts; attempt++)
        {
            try
            {
                var response = await operation();

                if (response.IsSuccessStatusCode || !IsRetryableStatusCode(response.StatusCode))
                {
                    return response;
                }

                if (attempt < maxAttempts)
                {
                    _logger.LogWarning("Attempt {Attempt} failed with status {StatusCode}. Retrying in {Delay}ms",
                        attempt, response.StatusCode, delay);

                    await Task.Delay(delay);
                    delay *= 2; // Exponential backoff
                }
                else
                {
                    return response;
                }
            }
            catch (Exception ex) when (attempt < maxAttempts && IsRetryableException(ex))
            {
                _logger.LogWarning(ex, "Attempt {Attempt} failed with exception. Retrying in {Delay}ms",
                    attempt, delay);

                await Task.Delay(delay);
                delay *= 2;
            }
        }

        // This should never be reached, but just in case
        throw new InvalidOperationException("All retry attempts failed");
    }

    private void ConfigureHttpClient()
    {
        _httpClient.BaseAddress = new Uri(_settings.BaseUrl);
        _httpClient.DefaultRequestHeaders.Clear();
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_settings.AccessToken}");
        _httpClient.DefaultRequestHeaders.Add("X-Idempotency-Key", Guid.NewGuid().ToString());
        _httpClient.Timeout = TimeSpan.FromSeconds(_settings.TimeoutSeconds);
    }

    private static bool IsRetryableStatusCode(HttpStatusCode statusCode)
    {
        return statusCode is
            HttpStatusCode.RequestTimeout or
            HttpStatusCode.TooManyRequests or
            HttpStatusCode.InternalServerError or
            HttpStatusCode.BadGateway or
            HttpStatusCode.ServiceUnavailable or
            HttpStatusCode.GatewayTimeout;
    }

    private static bool IsRetryableException(Exception ex)
    {
        return ex is HttpRequestException or TaskCanceledException;
    }

    private void ValidateCreatePreferenceRequest(CreatePreferenceRequest request)
    {
        if (request.TransactionAmount <= 0)
        {
            throw new ArgumentException("Transaction amount must be greater than zero", nameof(request.TransactionAmount));
        }

        if (string.IsNullOrWhiteSpace(request.PayerEmail))
        {
            throw new ArgumentException("Payer email is required", nameof(request.PayerEmail));
        }

        if (!IsValidEmail(request.PayerEmail))
        {
            throw new ArgumentException("Invalid email format", nameof(request.PayerEmail));
        }

        if (string.IsNullOrWhiteSpace(request.Description))
        {
            throw new ArgumentException("Description is required", nameof(request.Description));
        }
    }

    private void ValidateRefundRequest(CreateRefundRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.PaymentId))
        {
            throw new ArgumentException("Payment ID is required", nameof(request.PaymentId));
        }

        if (request.Amount.HasValue && request.Amount <= 0)
        {
            throw new ArgumentException("Refund amount must be greater than zero", nameof(request.Amount));
        }
    }

    private static bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }
}

// Internal DTO for MercadoPago API response
internal class MercadoPagoPreferenceResponse
{
    public string Id { get; set; } = string.Empty;
    public string InitPoint { get; set; } = string.Empty;
    public string SandboxInitPoint { get; set; } = string.Empty;
    public DateTime DateCreated { get; set; }
}
