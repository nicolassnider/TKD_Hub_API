using MercadoPago.Client.Preference;
using MercadoPago.Config;
using MercadoPago.Resource.Preference;
using Microsoft.Extensions.Options;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Infrastructure.Settings;

namespace TKDHubAPI.Infrastructure.External;
public class MercadoPagoService : IMercadoPagoService
{
    private readonly MercadoPagoSettings _settings;
    public MercadoPagoService(IOptions<MercadoPagoSettings> options)
    {
        _settings = options.Value;
    }

    public async Task<string> CreatePreferenceAsync(decimal amount, string description, string payerEmail)
    {
        // Set the access token before making any API call
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
        Preference preference = await client.CreateAsync(request);
        return preference.InitPoint; // Payment URL
    }
}
