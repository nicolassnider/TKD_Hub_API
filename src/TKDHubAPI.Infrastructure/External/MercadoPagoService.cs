using Microsoft.Extensions.Options;
using TKDHubAPI.Application.Interfaces;

namespace TKDHubAPI.Infrastructure.External;
public class MercadoPagoService : IMercadoPagoService
{
    private readonly MercadoPagoSettings _settings;
    public MercadoPagoService(IOptions<MercadoPagoSettings> options)
    {
        _settings = options.Value;
        MercadoPagoConfig.AccessToken = _settings.AccessToken;
    }

    public async Task<string> CreatePreferenceAsync(decimal amount, string description, string payerEmail)
    {
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
