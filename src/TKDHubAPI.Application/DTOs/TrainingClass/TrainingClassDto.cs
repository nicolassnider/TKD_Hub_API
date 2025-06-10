namespace TKDHubAPI.Application.DTOs.TrainingClass;
public class TrainingClassDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int DojaangId { get; set; }
    public string? DojaangName { get; set; }
    public int CoachId { get; set; }
    public string? CoachName { get; set; }
    public List<ClassScheduleDto> Schedules { get; set; } = [];
}
