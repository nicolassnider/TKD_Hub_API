namespace TKDHubAPI.Application.DTOs.Dashboard;
public class DashboardRequest
{
    public string UserRole { get; set; } // "Coach" or "Admin"
    public List<string>? Widgets { get; set; } // Optional: ["ActiveMembers", "Revenue", ...]
}

