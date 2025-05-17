namespace TKDHubAPI.Domain.Entities;
public class Tournament
{

    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Location { get; set; } = string.Empty;
    public string Organizer { get; set; } = string.Empty;
}
