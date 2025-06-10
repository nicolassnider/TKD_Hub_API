namespace TKDHubAPI.Domain.Entities;

public class StudentClass : BaseEntity
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public User Student { get; set; }
    public int TrainingClassId { get; set; }
    public TrainingClass TrainingClass { get; set; }
    public DateOnly Date { get; set; }
    public bool Attended { get; set; }
}
