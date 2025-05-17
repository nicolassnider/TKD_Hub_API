namespace TKDHubAPI.Domain.Entities;
public class Match
{
    public enum MatchStatus { Scheduled, InProgress, Completed, Cancelled }
    public int Id { get; set; }
    public int TournamentId { get; set; } // FK to Tournament
    public int RedCornerStudentId { get; set; } // FK to User (Red Corner)
    public int BlueCornerStudentId { get; set; } // FK to User (Blue Corner)
    public int? WinnerStudentId { get; set; } // FK to User (optional, for the winner)
    public int ScoreRed { get; set; } = 0;
    public int ScoreBlue { get; set; } = 0;
    public int Round { get; set; } = 1;
    public MatchStatus Status { get; set; } = MatchStatus.Scheduled;
    public DateTime MatchDate { get; set; } = DateTime.UtcNow;
    public Tournament Tournament { get; set; } = null!;
    public User RedCornerStudent { get; set; } = null!;
    public User BlueCornerStudent { get; set; } = null!;
    public User? WinnerStudent { get; set; } = null!;
}
