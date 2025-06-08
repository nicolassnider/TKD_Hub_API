namespace TKDHubAPI.Application.DTOs.User;

public class UpsertCoachDto
{
    public int? Id { get; set; } // If present, update; if null, create
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public Gender? Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public int? DojaangId { get; set; }
    public int? RankId { get; set; }
    public DateTime? JoinDate { get; set; }
    public List<int> RoleIds { get; set; }
    public List<int> ManagedDojaangIds { get; set; } // List of Dojaang IDs managed by the coach
}
