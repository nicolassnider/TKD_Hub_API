namespace TKDHubAPI.Application.DTOs.User;
[ExcludeFromCodeCoverage]
public class UpdateStudentDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public Gender? Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public int? DojaangId { get; set; }
    public int? RankId { get; set; }
    public DateTime? JoinDate { get; set; }
    public bool? IsActive { get; set; }
}
