using Azure.Messaging.ServiceBus;
using Microsoft.Extensions.Options;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Application.Settings;

namespace TKDHubAPI.Infrastructure.External;

public class ServiceBusService : IServiceBusService
{
    private readonly ServiceBusClient _client;
    private readonly ServiceBusSettings _settings;

    public ServiceBusService(IOptions<ServiceBusSettings> settings)
    {
        _settings = settings.Value;
        _client = new ServiceBusClient(_settings.ConnectionString);
    }

    public async Task SendMessageAsync(string queueName, string message)
    {
        var sender = _client.CreateSender(queueName);
        var serviceBusMessage = new ServiceBusMessage(message);
        await sender.SendMessageAsync(serviceBusMessage);
    }

    public async Task SendPaymentMessageAsync(string message)
    {
        await SendMessageAsync(_settings.PaymentQueue, message);
    }
}
