namespace TKDHubAPI.Domain.Entities;
internal class TournamentRegistration
{
    /*
     * •	Id
•	TournamentId (FK to Tournament)
•	StudentId (FK to User)
•	RegistrationDate
•	Category
•	Status (enum: Registered, Confirmed, Canceled)
     */
    public enum RegistrationStatus { Registered, Confirmed, Canceled }
    public int Id { get; set; }
    public int TournamentId { get; set; } // FK to Tournament
    public int StudentId { get; set; } // FK to User
    public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
    public string Category { get; set; } = string.Empty; // e.g., "Black Belt", "Color Belt"
    public RegistrationStatus Status { get; set; } = RegistrationStatus.Registered; // Default to Registered
    public Tournament Tournament { get; set; } = null!; // Navigation property to Tournament
    public User Student { get; set; } = null!; // Navigation property to User (Student)
    public override string ToString()
    {
        return $"TournamentRegistration: {Id}, TournamentId: {TournamentId}, StudentId: {StudentId}, RegistrationDate: {RegistrationDate}, Category: {Category}, Status: {Status}";
    }
}
