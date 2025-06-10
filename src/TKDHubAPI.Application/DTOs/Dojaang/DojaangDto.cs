namespace TKDHubAPI.Application.DTOs.Dojaang;
public class DojaangDto
{
    public int Id { get; set; }
    public string Name { get; set; }

    public string Location { get; set; }
    public string Address { get; set; }
    public string PhoneNumber { get; set; }
    public string Email { get; set; }
    public string KoreanName { get; set; }
    public string KoreanNamePhonetic { get; set; }
    public int CoachId { get; set; }
    public string CoachName { get; set; } // Add this
    public bool IsActive { get; set; }
}
