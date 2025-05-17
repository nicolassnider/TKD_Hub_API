namespace TKDHubAPI.Domain.Entities;
public class Event
{
    public enum EventType { Class, Seminar, Grading, Tournament, Other }

    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; } = string.Empty;
    public EventType Type { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Location { get; set; } = string.Empty;
    public int CoachId { get; set; }

}
