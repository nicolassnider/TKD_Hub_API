namespace TKDHubAPI.Domain.Entities;
public class UserUserRole
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int UserRoleId { get; set; }
    public UserRole UserRole { get; set; } = null!;
}
