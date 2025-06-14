namespace TKDHubAPI.Domain.Entities;
public partial class Tul : BaseEntity
{
    [Required]
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [ForeignKey("Rank")]  // Add ForeignKey attribute
    public int RecommendedRankId { get; set; }

    [Required]  // Add Required attribute
    [MaxLength(2048)]
    public Uri VideoUrl { get; set; }

    [Required] // Add Required attribute
    [MaxLength(2048)]
    public Uri ImageUrl { get; set; }

    // Navigation properties

    public Rank RecommendedRank { get; set; }

    public ICollection<TulTechnique> TulTechniques { get; set; } = new List<TulTechnique>();
}


