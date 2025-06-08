namespace TKDHubAPI.Domain.Entities;
public partial class Event : BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; } = string.Empty;
    public EventType Type { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Location { get; set; } = string.Empty;
    public int? CoachId { get; set; }
    public User? Coach { get; set; }
    public int? DojaangId { get; set; }
    public Dojaang? Dojaang { get; set; }


    public ICollection<EventAttendance> EventAttendances { get; set; } = new List<EventAttendance>();
}


