namespace TKDHubAPI.Application.DTOs.TrainingClass;

public class StudentClassDto
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public string? StudentName { get; set; }
    public int TrainingClassId { get; set; }
    public DateOnly Date { get; set; }
    public bool Attended { get; set; }
}
