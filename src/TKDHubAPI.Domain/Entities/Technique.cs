namespace TKDHubAPI.Domain.Entities;
public partial class Technique : BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; } = string.Empty;
    public TechniqueType Type { get; set; }
    public int RecommendedRankId { get; set; }
    public Uri VideoUrl { get; set; }
    public Uri ImageUrl { get; set; }

    /// <summary>
    /// Navigation property: Tuls that include this technique (via TulTechnique join entity).
    /// </summary>
    public ICollection<TulTechnique> TulTechniques { get; set; } = new List<TulTechnique>();
}
