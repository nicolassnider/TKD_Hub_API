namespace TKDHubAPI.Application.DTOs.Promotion;
/// <summary>
/// DTO for creating a new promotion.
/// </summary>
public class CreatePromotionDto
{
    [Required]
    public int StudentId { get; set; }

    public int RankId { get; set; }

    public DateTime PromotionDate { get; set; }

    [Required]
    public int CoachId { get; set; }

    [MaxLength(1000)]
    public string? Notes { get; set; }

    [Required]
    public int DojaangId { get; set; }
}
