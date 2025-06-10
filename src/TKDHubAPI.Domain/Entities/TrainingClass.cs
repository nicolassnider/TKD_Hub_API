namespace TKDHubAPI.Domain.Entities;
public class TrainingClass : BaseEntity
{
    public int Id { get; set; }
    public string Name { get; set; } // e.g., "Kids", "Infantiles", "Juveniles y Adultos"
    public int DojaangId { get; set; }
    public Dojaang Dojaang { get; set; }
    public int CoachId { get; set; }
    public User Coach { get; set; }
    public ICollection<ClassSchedule> Schedules { get; set; } = new List<ClassSchedule>();
    public ICollection<StudentClass> StudentClasses { get; set; } = new List<StudentClass>();
}

