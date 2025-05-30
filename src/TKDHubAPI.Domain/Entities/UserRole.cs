namespace TKDHubAPI.Domain.Entities;
public class UserRole
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    // Navigation property for the many-to-many relationship with User
    public ICollection<UserUserRole> UserUserRoles { get; set; } = new List<UserUserRole>();
}
