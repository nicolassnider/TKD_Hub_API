namespace TKDHubAPI.Application.DTOs.TrainingClass;
[ExcludeFromCodeCoverage]
public class TrainingClassDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int DojaangId { get; set; }
    public string? DojaangName { get; set; }
    public int CoachId { get; set; }
    public string? CoachName { get; set; }
    public int? Capacity { get; set; }
    public int EnrolledStudentsCount { get; set; }
    public string? Schedule { get; set; }
    public List<ClassScheduleDto> Schedules { get; set; } = [];
}
