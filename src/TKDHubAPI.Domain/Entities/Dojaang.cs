namespace TKDHubAPI.Domain.Entities;
public class Dojaang
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string KoreanName { get; set; } = string.Empty;
    public string KoreanNamePhonetic { get; set; } = string.Empty;

    public int CoachId { get; set; } // FK to User (Coach)
    public User Coach { get; set; } = null!;

    // Navigation properties

    /// <summary>
    /// Users (students and coaches) associated with this dojaang.
    /// </summary>
    public ICollection<User> Users { get; set; } = new List<User>();

    /// <summary>
    /// Events (classes, seminars, etc.) held at this dojaang.
    /// </summary>
    public ICollection<Event> Events { get; set; } = new List<Event>();

    /// <summary>
    /// Tournaments organized or hosted by this dojaang.
    /// </summary>
    public ICollection<Tournament> Tournaments { get; set; } = new List<Tournament>();
}