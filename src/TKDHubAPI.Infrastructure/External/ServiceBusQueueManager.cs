using Azure.Identity;

namespace TKDHubAPI.Infrastructure.External;

public class ServiceBusQueueManager
{
    private readonly string _subscriptionId;
    private readonly string _resourceGroup;
    private readonly string _namespaceName;

    public ServiceBusQueueManager(string subscriptionId, string resourceGroup, string namespaceName)
    {
        _subscriptionId = subscriptionId;
        _resourceGroup = resourceGroup;
        _namespaceName = namespaceName;
    }

    public async Task EnsureQueueExistsAsync(string queueName)
    {
        var armClient = new ArmClient(new DefaultAzureCredential());
        var sbNamespace = ServiceBusNamespaceResource.CreateResourceIdentifier(_subscriptionId, _resourceGroup, _namespaceName);
        var sbNamespaceResource = armClient.GetServiceBusNamespaceResource(sbNamespace);

        var queueCollection = sbNamespaceResource.GetServiceBusQueues();
        if (!await queueCollection.ExistsAsync(queueName))
        {
            await queueCollection.CreateOrUpdateAsync(
                Azure.WaitUntil.Completed,
                queueName,
                new ServiceBusQueueData());
        }
    }
}
