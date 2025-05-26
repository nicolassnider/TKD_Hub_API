namespace TKDHubAPI.Application.DTOs.Dojaang;
public class CreateDojaangDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(300)]
    public string Address { get; set; } = string.Empty;

    [MaxLength(300)]
    public string Location { get; set; } = string.Empty;

    [MaxLength(30)]
    public string PhoneNumber { get; set; } = string.Empty;

    [EmailAddress]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(200)]
    public string KoreanName { get; set; } = string.Empty;

    [MaxLength(200)]
    public string KoreanNamePhonetic { get; set; } = string.Empty;

    public int? CoachId { get; set; }
}