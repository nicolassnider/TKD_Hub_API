namespace TKDHubAPI.Application.DTOs.User;
[ExcludeFromCodeCoverage]
public class CreateUserDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string PhoneNumber { get; set; }
    public Gender? Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public int? DojaangId { get; set; }
    public int? RankId { get; set; } // Renamed from CurrentRankId to RankId
    public DateTime? JoinDate { get; set; }
    public List<int> RoleIds { get; set; } // Assign roles on creation
}
