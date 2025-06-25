namespace TKDHubAPI.Application.DTOs.TrainingClass;

public class GetAttendanceHistoryRequest
{
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
}
