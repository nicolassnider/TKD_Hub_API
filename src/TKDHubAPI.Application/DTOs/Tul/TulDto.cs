namespace TKDHubAPI.Application.DTOs.Tul;
public class TulDto
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string Description { get; set; } = default!;
    public int RecommendedRankId { get; set; }
    public string? VideoUrl { get; set; }
    public string? ImageUrl { get; set; }
}