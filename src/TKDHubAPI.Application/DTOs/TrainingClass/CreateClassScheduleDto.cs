namespace TKDHubAPI.Application.DTOs.TrainingClass;
[ExcludeFromCodeCoverage]
public class CreateClassScheduleDto
{
    public DayOfWeek Day { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
}
