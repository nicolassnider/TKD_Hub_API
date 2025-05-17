namespace TKDHubAPI.Domain.Entities;
public class Promotion
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public int RankId { get; set; }
    public DateTime PromotionDate { get; set; }
    public int CoachId { get; set; }
    public string Notes { get; set; } = string.Empty;
}
