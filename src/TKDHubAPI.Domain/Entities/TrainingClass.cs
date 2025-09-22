namespace TKDHubAPI.Domain.Entities;
public partial class TrainingClass : BaseEntity
{
    public string Name { get; set; } = string.Empty; // e.g., "Kids", "Infantiles", "Juveniles y Adultos"
    public string? Description { get; set; }
    public int? Capacity { get; set; }
    public int DojaangId { get; set; }
    public Dojaang? Dojaang { get; set; }
    public int CoachId { get; set; }
    public User? Coach { get; set; }
    public ICollection<ClassSchedule> Schedules { get; set; } = new List<ClassSchedule>();
    public ICollection<StudentClass> StudentClasses { get; set; } = new List<StudentClass>();
}
