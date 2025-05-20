using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TKDHubAPI.Domain.Entities;


public enum UserRole
{
    Admin,
    Instructor,
    Member,
    Guest
}

public enum Gender
{
    Male,
    Female,
    Other
}

public class User
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    public UserRole Role { get; set; }

    public DateTime? DateOfBirth { get; set; }

    public Gender? Gender { get; set; }

    [MaxLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;

    [ForeignKey("Dojaang")]
    public int? DojaangId { get; set; }

    [ForeignKey("Rank")]
    public int? CurrentRankId { get; set; }

    public DateTime? JoinDate { get; set; } = DateTime.UtcNow;

    // Navigation properties

    public Dojaang? Dojaang { get; set; }

    public Rank? CurrentRank { get; set; }

    public ICollection<TournamentRegistration> TournamentRegistrations { get; set; } = new List<TournamentRegistration>();
    public ICollection<EventAttendance> EventAttendances { get; set; } = new List<EventAttendance>();
}