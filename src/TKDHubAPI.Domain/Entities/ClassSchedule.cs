namespace TKDHubAPI.Domain.Entities;

public partial class ClassSchedule : BaseEntity
{
    public int TrainingClassId { get; set; }
    public TrainingClass TrainingClass { get; set; }
    public DayOfWeek Day { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
}
