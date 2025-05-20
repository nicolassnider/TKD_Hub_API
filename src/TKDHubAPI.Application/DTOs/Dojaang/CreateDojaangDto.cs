namespace TKDHubAPI.Application.DTOs.Dojaang;
public class CreateDojaangDto
{
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string KoreanName { get; set; } = string.Empty;
    public string KoreanNamePhonetic { get; set; } = string.Empty;
    public int CoachId { get; set; }
}
