using Microsoft.Extensions.DependencyInjection; // Needed to resolve scoped services
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using TKDHubAPI.Application.Settings; // Assuming this path for ServiceBusSettings

namespace TKDHubAPI.Infrastructure.External;

public class ServiceBusInitializer : IHostedService
{
    private readonly IServiceProvider _serviceProvider; // To resolve scoped services
    private readonly ILogger<ServiceBusInitializer> _logger;
    private readonly ServiceBusSettings _settings;

    public ServiceBusInitializer(
        IServiceProvider serviceProvider,
        ILogger<ServiceBusInitializer> logger,
        ServiceBusSettings settings) // Inject ServiceBusSettings directly here
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
        _settings = settings;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("ServiceBusInitializer is starting...");

        try
        {
            // Use a scope to resolve ServiceBusQueueManager if it's scoped (AddScoped)
            // This ensures that any dependencies of ServiceBusQueueManager that are also scoped
            // are correctly resolved for this operation.
            using (var scope = _serviceProvider.CreateScope())
            {
                var queueManager = scope.ServiceProvider.GetRequiredService<ServiceBusQueueManager>();

                // Ensure the payment queue exists
                await queueManager.EnsureQueueExistsAsync(_settings.PaymentQueue);
            }

            _logger.LogInformation("Service Bus queue initialization completed successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred during Service Bus queue initialization.");
            // Depending on your application's tolerance for startup failures,
            // you might re-throw or handle more gracefully.
            // For critical services, you might want to stop the application.
            throw; // Re-throw to indicate a critical startup failure
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("ServiceBusInitializer is stopping.");
        return Task.CompletedTask;
    }
}