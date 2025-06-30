namespace TKDHubAPI.Application.DTOs.User;
[ExcludeFromCodeCoverage]
/// <summary>
/// DTO for creating a new Student user.
/// Does not inherit from CreateUserDto and only includes allowed properties.
/// </summary>
public class CreateStudentDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public Gender? Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public int? DojaangId { get; set; }
    public int? RankId { get; set; }
}
