namespace TKDHubAPI.Domain.Entities;
public partial class Match : BaseEntity
{

    // Foreign key to Tournament
    public int TournamentId { get; set; }

    // Foreign key to User (Red Corner)
    public int RedCornerStudentId { get; set; }

    // Foreign key to User (Blue Corner)
    public int BlueCornerStudentId { get; set; }

    // Foreign key to User (Winner, optional)
    public int? WinnerStudentId { get; set; }

    public int ScoreRed { get; set; } = 0;
    public int ScoreBlue { get; set; } = 0;
    public int Round { get; set; } = 1;
    public MatchStatus Status { get; set; } = MatchStatus.Scheduled;
    public DateTime MatchDate { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Tournament Tournament { get; set; } = null!;
    public User RedCornerStudent { get; set; } = null!;
    public User BlueCornerStudent { get; set; } = null!;
    public User? WinnerStudent { get; set; }

    // Optional: If you want to track the Dojaang where the match took place
    public int? DojaangId { get; set; }
    public Dojaang? Dojaang { get; set; }
}
