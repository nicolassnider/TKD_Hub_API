namespace TKDHubAPI.Domain.Entities;
public class StudentClassAttendance : BaseEntity
{
    public int StudentClassId { get; set; }
    public StudentClass StudentClass { get; set; }

    public DateTime AttendedAt { get; set; } // Date and time of attendance

    public AttendanceStatus Status { get; set; } // e.g., Present, Absent, Late, etc.

    // Optionally, add audit fields or notes
    public string? Notes { get; set; }
}
