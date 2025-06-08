namespace TKDHubAPI.Domain.Entities;
public class Dojaang : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string KoreanName { get; set; } = string.Empty;
    public string KoreanNamePhonetic { get; set; } = string.Empty;
    public int? CoachId { get; set; }
    public User? Coach { get; set; }

    public bool IsActive { get; set; } = true;

    // Navigation properties
    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<Event> Events { get; set; } = new List<Event>();
    public ICollection<Tournament> Tournaments { get; set; } = new List<Tournament>();

    // Many-to-many: Dojaang <-> User (coaches)
    public ICollection<UserDojaang> UserDojaangs { get; set; } = new List<UserDojaang>();
}

