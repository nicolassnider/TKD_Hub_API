using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Infrastructure.Settings;

namespace TKDHubAPI.Infrastructure.HealthChecks;

// Simple health check implementation without external dependencies
public class MercadoPagoHealthCheck
{
    private readonly IMercadoPagoService _mercadoPagoService;
    private readonly MercadoPagoSettings _settings;
    private readonly ILogger<MercadoPagoHealthCheck> _logger;

    public MercadoPagoHealthCheck(
        IMercadoPagoService mercadoPagoService,
        IOptions<MercadoPagoSettings> settings,
        ILogger<MercadoPagoHealthCheck> logger)
    {
        _mercadoPagoService = mercadoPagoService;
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task<bool> CheckHealthAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            // Simple health check - try to get a non-existent payment
            // This tests API connectivity without side effects
            await _mercadoPagoService.GetPaymentAsync("health-check-test", cancellationToken);

            // If we get here without exception, the service is healthy
            _logger.LogInformation("MercadoPago health check passed");
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "MercadoPago health check failed");
            return false;
        }
    }
}
