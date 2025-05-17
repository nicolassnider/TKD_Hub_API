namespace TKDHubAPI.Domain.Entities;
public class EventAttendance
{
    public enum AttendanceStatus { Attended, Absent, Late }

    public int Id { get; set; }
    public int EventId { get; set; }
    public int StudentId { get; set; }
    public DateTime AttendanceDate { get; set; }
    public DateTime AttendanceTime { get; set; }
    public AttendanceStatus Status { get; set; }

    // Navigation properties
    public Event Event { get; set; } = null!;
    public User Student { get; set; } = null!;
}