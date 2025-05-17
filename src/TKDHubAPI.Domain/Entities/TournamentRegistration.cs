namespace TKDHubAPI.Domain.Entities;
public class TournamentRegistration
{
    public enum RegistrationStatus { Registered, Confirmed, Canceled }

    public int Id { get; set; }
    public int TournamentId { get; set; } // FK to Tournament
    public int StudentId { get; set; } // FK to User
    public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
    public string Category { get; set; } = string.Empty; // e.g., "Black Belt", "Color Belt"
    public RegistrationStatus Status { get; set; } = RegistrationStatus.Registered; // Default to Registered

    // Navigation property to Tournament
    public Tournament Tournament { get; set; } = null!;

    // Navigation property to User (Student)
    public User Student { get; set; } = null!;

    // Add inverse navigation properties for completeness
    // (These should also be added to Tournament and User classes)

    // In Tournament.cs:
    // public ICollection<TournamentRegistration> Registrations { get; set; } = new List<TournamentRegistration>();

    // In User.cs (if you want to track all tournament registrations for a user):
    // public ICollection<TournamentRegistration> TournamentRegistrations { get; set; } = new List<TournamentRegistration>();

    public override string ToString()
    {
        return $"TournamentRegistration: {Id}, TournamentId: {TournamentId}, StudentId: {StudentId}, RegistrationDate: {RegistrationDate}, Category: {Category}, Status: {Status}";
    }
}
