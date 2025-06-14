namespace TKDHubAPI.Domain.Entities;
public partial class TulTechnique : BaseEntity
{
    public int TulId { get; set; }
    public Tul Tul { get; set; } = null!;

    public int TechniqueId { get; set; }
    public Technique Technique { get; set; } = null!;

    public int Order { get; set; }
}

