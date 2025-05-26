namespace TKDHubAPI.Domain.Entities;
public class UserRole
{
    public int Id { get; set; }

    // The name of the role, e.g., "Admin", "Coach", "Student"
    public string Name { get; set; } = string.Empty;

    // Navigation property for the many-to-many relationship with User
    public ICollection<UserUserRole> UserUserRoles { get; set; } = new List<UserUserRole>();
}
