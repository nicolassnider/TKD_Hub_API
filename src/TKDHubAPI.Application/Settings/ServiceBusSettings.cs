namespace TKDHubAPI.Application.Settings;
public class ServiceBusSettings
{
    public string PaymentQueue { get; set; } = string.Empty;
    public string ConnectionString { get; set; } = string.Empty;

    // For management operations (queue creation)
    public string SubscriptionId { get; set; } = string.Empty;
    public string ResourceGroup { get; set; } = string.Empty;
    public string Namespace { get; set; } = string.Empty;

    // Add the TenantId property
    public string TenantId { get; set; } = string.Empty;
}