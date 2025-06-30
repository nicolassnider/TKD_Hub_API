namespace TKDHubAPI.Application.DTOs.TrainingClass;
[ExcludeFromCodeCoverage]
/// <summary>
/// Request DTO for registering a student's attendance in a class.
/// </summary>
public class RegisterAttendanceRequest
{
    /// <summary>
    /// The date and time when the student attended the class.
    /// </summary>
    public DateTime AttendedAt { get; set; }

    /// <summary>
    /// The attendance status (e.g., Present, Absent, Late, Excused).
    /// </summary>
    public AttendanceStatus Status { get; set; }

    /// <summary>
    /// Optional notes for the attendance record.
    /// </summary>
    public string? Notes { get; set; }
}
