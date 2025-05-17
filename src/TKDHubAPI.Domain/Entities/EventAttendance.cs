namespace TKDHubAPI.Domain.Entities;
internal class EventAttendance
{
    public enum AttendanceStatus { Attended, Absent, Late }

    public int Id { get; set; }
    public int EventId { get; set; }
    public int StudentId { get; set; }
    public DateTime AttendanceDate { get; set; }
    public DateTime AttendanceTime { get; set; }
    public AttendanceStatus Status { get; set; }
}
