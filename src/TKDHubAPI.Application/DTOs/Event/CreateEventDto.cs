namespace TKDHubAPI.Application.DTOs.Event;
/// <summary>
/// DTO for creating a new event.
/// </summary>
public class CreateEventDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    public int Type { get; set; } // Use int for enum binding (EventType)

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    [MaxLength(500)]
    public string? Location { get; set; }

    [Required]
    public int CoachId { get; set; }

    public int? DojaangId { get; set; }
}