namespace TKDHubAPI.Application.DTOs.Promotion;
/// <summary>
/// DTO for reading promotion details.
/// </summary>
public class PromotionDto
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public string? StudentName { get; set; }      // Added
    public int RankId { get; set; }
    public string? RankName { get; set; }         // Added
    public DateTime PromotionDate { get; set; }
    public int CoachId { get; set; }
    public string? Notes { get; set; }
    public int DojaangId { get; set; }
}
