namespace TKDHubAPI.Application.DTOs.TrainingClass;
[ExcludeFromCodeCoverage]
public class ClassScheduleDto
{
    public int Id { get; set; }
    public DayOfWeek Day { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
}
