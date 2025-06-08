namespace TKDHubAPI.Application.DTOs.User;
public class UserDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public Gender? Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public int? DojaangId { get; set; }
    public int? CurrentRankId { get; set; }
    public DateTime? JoinDate { get; set; }
    public List<string> Roles { get; set; }
    public List<int> ManagedDojaangIds { get; set; }
    public bool IsActive { get; set; } = true;
}
