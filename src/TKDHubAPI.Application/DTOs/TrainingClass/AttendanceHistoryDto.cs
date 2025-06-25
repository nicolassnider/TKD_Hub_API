namespace TKDHubAPI.Application.DTOs.TrainingClass;
public class AttendanceHistoryDto
{
    public int Id { get; set; }
    public DateTime AttendedAt { get; set; }
    public string Status { get; set; }
    public string? Notes { get; set; }
    public int StudentClassId { get; set; }
    public string? StudentName { get; set; }
    public string? ClassName { get; set; }
}
