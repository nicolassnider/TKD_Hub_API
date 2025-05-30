namespace TKDHubAPI.Domain.Entities;
public class Tournament
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    [MaxLength(255)]
    public string Location { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Organizer { get; set; } = string.Empty;

    public int? DojaangId { get; set; }
    public Dojaang? Dojaang { get; set; }

    // Navigation property for registrations
    public ICollection<TournamentRegistration> Registrations { get; set; } = new List<TournamentRegistration>();
}

