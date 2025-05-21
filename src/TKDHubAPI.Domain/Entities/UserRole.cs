namespace TKDHubAPI.Domain.Entities;
public class UserRole
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public ICollection<UserUserRole> UserUsers { get; set; } = new List<UserUserRole>();
}
