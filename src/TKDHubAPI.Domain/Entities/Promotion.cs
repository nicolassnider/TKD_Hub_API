namespace TKDHubAPI.Domain.Entities;
public class Promotion
{
    public int Id { get; set; }

    // Foreign key to the promoted student (User)
    public int StudentId { get; set; }

    // Foreign key to the new rank achieved
    public int RankId { get; set; }

    public DateTime PromotionDate { get; set; }

    // Foreign key to the coach who approved the promotion (User)
    public int CoachId { get; set; }

    public string Notes { get; set; } = string.Empty;

    // Navigation properties
    public User Student { get; set; } = null!;
    public Rank Rank { get; set; } = null!;
    public User Coach { get; set; } = null!;

    public int DojangId { get; set; } // FK to Dojang
    public Dojang Dojang { get; set; } = null;
}
