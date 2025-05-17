namespace TKDHubAPI.Domain.Entities;
public class Technique
{
    public enum Type { Kick, Block, Punch, Tul }

    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; } = string.Empty;
    public Type MyProperty { get; set; }
    public int RecommendedRankId { get; set; }
    public Uri VideoUrl { get; set; }
    public Uri ImageUrl { get; set; }
}
