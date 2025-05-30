namespace TKDHubAPI.Domain.Entities;
public partial class TournamentRegistration
{

    [Key]
    public int Id { get; set; }

    [ForeignKey("Tournament")]
    public int TournamentId { get; set; }

    [ForeignKey("Student")]
    public int StudentId { get; set; }

    public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;

    [Required]
    [MaxLength(255)]
    public string Category { get; set; } = string.Empty;

    public RegistrationStatus Status { get; set; } = RegistrationStatus.Registered;

    [Required]
    public Tournament Tournament { get; set; } = null!;

    [Required]
    public User Student { get; set; } = null!;

    public override string ToString()
    {
        return $"TournamentRegistration: {Id}, TournamentId: {TournamentId}, StudentId: {StudentId}, RegistrationDate: {RegistrationDate}, Category: {Category}, Status: {Status}";
    }
}

