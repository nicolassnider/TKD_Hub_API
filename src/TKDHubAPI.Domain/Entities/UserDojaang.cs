namespace TKDHubAPI.Domain.Entities;
public class UserDojaang
{
    public int UserId { get; set; }
    public User User { get; set; }
    public int DojaangId { get; set; }
    public Dojaang Dojaang { get; set; }

    // Add this property to distinguish the user's role in the dojaang
    public string Role { get; set; } = string.Empty; // e.g., "Coach" or "Student"
}
