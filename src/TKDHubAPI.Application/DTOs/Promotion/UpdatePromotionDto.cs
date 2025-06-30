namespace TKDHubAPI.Application.DTOs.Promotion;
[ExcludeFromCodeCoverage]
/// <summary>
/// DTO for updating a promotion.
/// </summary>
public class UpdatePromotionDto
{
    [Required]
    public int Id { get; set; }

    [Required]
    public int StudentId { get; set; }

    [Required]
    public int RankId { get; set; }

    [Required]
    public DateTime PromotionDate { get; set; }

    [Required]
    public int CoachId { get; set; }

    [MaxLength(1000)]
    public string? Notes { get; set; }

    [Required]
    public int DojaangId { get; set; }
}