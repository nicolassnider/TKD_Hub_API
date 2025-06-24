using Microsoft.AspNetCore.SignalR;

namespace TKDHubAPI.WebAPI.SignalR;

/// <summary>
/// SignalR hub for payment notifications.
/// </summary>
public class PaymentHub : Hub
{
    // Optionally, you can add methods for client-to-server communication here.
    // For now, the backend will use this hub to push payment events to clients.
}
