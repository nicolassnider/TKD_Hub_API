namespace TKDHubAPI.Application.DTOs.TrainingClass;
public class CreateClassScheduleDto
{
    public DayOfWeek Day { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
}
