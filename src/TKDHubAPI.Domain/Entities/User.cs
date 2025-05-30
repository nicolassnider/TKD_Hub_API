namespace TKDHubAPI.Domain.Entities;

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

    public DateTime? DateOfBirth { get; set; }
    public Gender? Gender { get; set; }

    [MaxLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;

    // For students: a student belongs to only one dojaang
    [ForeignKey("Dojaang")]
    public int? DojaangId { get; set; }
    public Dojaang? Dojaang { get; set; }

    [ForeignKey("Rank")]
    public int? CurrentRankId { get; set; }
    public Rank? CurrentRank { get; set; }

    public DateTime? JoinDate { get; set; } = DateTime.UtcNow;

    // Many-to-many: User <-> UserRole
    public ICollection<UserUserRole> UserUserRoles { get; set; } = new List<UserUserRole>();

    // Many-to-many: User <-> Dojaang (as coach)
    public ICollection<UserDojaang> UserDojaangs { get; set; } = new List<UserDojaang>();

    // Domain relationships
    public ICollection<TournamentRegistration> TournamentRegistrations { get; set; } = new List<TournamentRegistration>();
    public ICollection<EventAttendance> EventAttendances { get; set; } = new List<EventAttendance>();
    public ICollection<Promotion> PromotionsAsStudent { get; set; } = new List<Promotion>();
    public ICollection<Promotion> PromotionsAsCoach { get; set; } = new List<Promotion>();
    public ICollection<Match> MatchesAsRedCorner { get; set; } = new List<Match>();
    public ICollection<Match> MatchesAsBlueCorner { get; set; } = new List<Match>();
    public ICollection<Match> MatchesAsWinner { get; set; } = new List<Match>();
    public ICollection<Event> EventsCoached { get; set; } = new List<Event>();

    // Helper method for role checks (optional)
    public bool HasRole(string roleName) =>
        UserUserRoles.Any(uur => uur.UserRole.Name.Equals(roleName, StringComparison.OrdinalIgnoreCase));

    public bool ManagesDojaang(int dojaangId) =>
        UserDojaangs.Any(ud => ud.DojaangId == dojaangId);

    public bool IsCoachOfDojaang(int dojaangId)
    {
        return UserDojaangs.Any(ud => ud.DojaangId == dojaangId && ud.Role == "Coach");
    }
}
