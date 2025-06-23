namespace TKDHubAPI.Application.Interfaces;

public interface IServiceBusService
{
    Task SendMessageAsync(string queueName, string message);
    Task SendPaymentMessageAsync(string message);
}
