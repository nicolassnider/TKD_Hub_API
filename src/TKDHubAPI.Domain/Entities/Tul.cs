namespace TKDHubAPI.Domain.Entities;
public class Tul
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int RecommendedRankId { get; set; }
    public Uri VideoUrl { get; set; }
    public Uri ImageUrl { get; set; }

    public ICollection<TulTechnique> TulTechniques { get; set; } = new List<TulTechnique>();
}
