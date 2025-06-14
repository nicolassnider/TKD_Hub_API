namespace TKDHubAPI.Domain.Entities;
public partial class UserDojaang : BaseEntity
{
    public int UserId { get; set; }
    public User User { get; set; }
    public int DojaangId { get; set; }
    public Dojaang Dojaang { get; set; }

    public string Role { get; set; } = string.Empty;
}
