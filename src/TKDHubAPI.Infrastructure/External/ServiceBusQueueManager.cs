using Azure.Identity;
using Azure.ResourceManager;
using Azure.ResourceManager.ServiceBus;
using TKDHubAPI.Application.Settings; // Add this using directive

namespace TKDHubAPI.Infrastructure.External;

public class ServiceBusQueueManager
{
    private readonly ServiceBusSettings _settings; // Store the settings object

    // Constructor now takes ServiceBusSettings
    public ServiceBusQueueManager(ServiceBusSettings settings)
    {
        _settings = settings ?? throw new ArgumentNullException(nameof(settings));
    }

    public async Task EnsureQueueExistsAsync(string queueName)
    {
        // 1. Configure DefaultAzureCredential with the explicit TenantId
        var credentialOptions = new DefaultAzureCredentialOptions
        {
            TenantId = _settings.TenantId // Use the TenantId from your settings
        };

        var credential = new DefaultAzureCredential(credentialOptions);

        // 2. Initialize ArmClient with the correctly configured credential and SubscriptionId
        // The SubscriptionId is also now coming from _settings
        var armClient = new ArmClient(credential, _settings.SubscriptionId);

        // 3. Create the ServiceBusNamespaceResourceIdentifier
        var sbNamespace = ServiceBusNamespaceResource.CreateResourceIdentifier(
            _settings.SubscriptionId, // Use from settings
            _settings.ResourceGroup,  // Use from settings
            _settings.Namespace       // Use from settings
        );

        // 4. Get the Service Bus Namespace Resource
        var sbNamespaceResource = armClient.GetServiceBusNamespaceResource(sbNamespace);

        // This line is essential to actually load the resource and ensure it's accessible.
        // It will throw an exception if the token/tenant is incorrect or permissions are missing.
        var loadedSbNamespaceResource = await sbNamespaceResource.GetAsync();
        if (loadedSbNamespaceResource == null)
        {
            throw new InvalidOperationException($"Service Bus Namespace '{_settings.Namespace}' not found or inaccessible with provided credentials.");
        }

        var queueCollection = loadedSbNamespaceResource.Value.GetServiceBusQueues();

        if (!await queueCollection.ExistsAsync(queueName))
        {
            Console.WriteLine($"Queue '{queueName}' does not exist. Creating it...");
            await queueCollection.CreateOrUpdateAsync(
                Azure.WaitUntil.Completed,
                queueName,
                new ServiceBusQueueData() { MaxSizeInMegabytes = 1024 } // Example: Set some properties for the queue
            );
            Console.WriteLine($"Queue '{queueName}' created successfully.");
        }
        else
        {
            Console.WriteLine($"Queue '{queueName}' already exists.");
        }
    }
}