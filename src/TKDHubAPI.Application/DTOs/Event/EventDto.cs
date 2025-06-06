namespace TKDHubAPI.Application.DTOs.Event;
/// <summary>
/// DTO for reading event details.
/// </summary>
public class EventDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Type { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string? Location { get; set; }
    public int CoachId { get; set; }
    public int? DojaangId { get; set; }
}
