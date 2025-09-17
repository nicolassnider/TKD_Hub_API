using MercadoPago.Client.Preference;
using MercadoPago.Config;
using MercadoPago.Resource.Preference;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TKDHubAPI.Application.DTOs.Payment;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Infrastructure.Settings;

namespace TKDHubAPI.Infrastructure.External;
public class MercadoPagoService : IMercadoPagoService
{
    private readonly MercadoPagoSettings _settings;
    private readonly ILogger<MercadoPagoService> _logger;

    public MercadoPagoService(IOptions<MercadoPagoSettings> options, ILogger<MercadoPagoService> logger)
    {
        _settings = options.Value;
        _logger = logger;
    }

    public async Task<CreatePreferenceResponse> CreatePreferenceAsync(decimal amount, string description, string payerEmail, CancellationToken cancellationToken = default)
    {
        if (amount <= 0)
            return new CreatePreferenceResponse { Success = false, ErrorMessage = "Amount must be greater than zero." };

        if (string.IsNullOrWhiteSpace(payerEmail))
            return new CreatePreferenceResponse { Success = false, ErrorMessage = "Payer email is required." };

        // Validate settings at runtime and fail fast if something is misconfigured
        if (string.IsNullOrWhiteSpace(_settings.AccessToken))
        {
            _logger.LogError("MercadoPago AccessToken is not configured.");
            return new CreatePreferenceResponse { Success = false, ErrorMessage = "Payment provider is not configured." };
        }

        // Set the access token for the SDK (global). Keep this call local to avoid surprises in parallel scenarios.
        MercadoPagoConfig.AccessToken = _settings.AccessToken;

        var request = new PreferenceRequest
        {
            Items = new List<PreferenceItemRequest>
            {
                new PreferenceItemRequest
                {
                    Title = description,
                    Quantity = 1,
                    UnitPrice = amount
                }
            },
            Payer = new PreferencePayerRequest
            {
                Email = payerEmail
            }
        };

        var client = new PreferenceClient();

        // Simple retry with exponential backoff to handle transient MercadoPago/API issues
        var maxAttempts = Math.Clamp(_settings.MaxRetries, 1, 10);
        var delayMs = Math.Clamp(_settings.InitialRetryDelayMs, 100, 60000);

        using (_logger.BeginScope(new { Amount = amount, Payer = payerEmail }))
        {
            for (int attempt = 1; attempt <= maxAttempts; attempt++)
            {
                try
                {
                    cancellationToken.ThrowIfCancellationRequested();
                    // The MercadoPago SDK's CreateAsync does not accept CancellationToken. We check before/after.
                    Preference preference = await client.CreateAsync(request);

                    if (preference == null)
                    {
                        _logger.LogWarning("MercadoPago returned null preference on attempt {Attempt}", attempt);
                        continue;
                    }

                    // InitPoint can be null depending on MercadoPago response; guard it
                    var url = preference.InitPoint ?? preference.SandboxInitPoint ?? string.Empty;
                    if (string.IsNullOrEmpty(url))
                    {
                        _logger.LogWarning("MercadoPago preference created but no InitPoint was returned. Preference id: {Id}", preference.Id);
                        return new CreatePreferenceResponse { Success = false, ErrorMessage = "Payment URL not available." };
                    }

                    return new CreatePreferenceResponse { Success = true, PaymentUrl = url };
                }
                catch (OperationCanceledException)
                {
                    _logger.LogInformation("CreatePreferenceAsync cancelled by caller.");
                    return new CreatePreferenceResponse { Success = false, ErrorMessage = "Operation cancelled." };
                }
                catch (Exception ex) when (attempt < maxAttempts)
                {
                    _logger.LogWarning(ex, "Attempt {Attempt} to create MercadoPago preference failed. Retrying after {Delay}ms.", attempt, delayMs);
                    try
                    {
                        await Task.Delay(delayMs, cancellationToken);
                    }
                    catch (OperationCanceledException)
                    {
                        _logger.LogInformation("Delay cancelled during retry backoff.");
                        return new CreatePreferenceResponse { Success = false, ErrorMessage = "Operation cancelled." };
                    }

                    delayMs = (int)Math.Min((long)delayMs * 2, 60000);
                    continue;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to create MercadoPago preference on attempt {Attempt}.", attempt);
                    return new CreatePreferenceResponse { Success = false, ErrorMessage = "Failed to create payment preference." };
                }
            }
        }

        // If we reach here, all retries exhausted
        return new CreatePreferenceResponse { Success = false, ErrorMessage = "Failed to create payment preference after retries." };
    }
}
