using System.ComponentModel.DataAnnotations;

namespace TKDHubAPI.Domain.Entities;
public partial class Rank
{

    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    public int Order { get; set; }

    [Required]
    public string Description { get; set; } = string.Empty;

    public BeltColor Color { get; set; }

    public BeltColor? StripeColor { get; set; }

    public int? DanLevel { get; set; }

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    // Navigation Property for Users
    public ICollection<User> Users { get; set; } = new List<User>();

    // Navigation Property for Tuls
    public ICollection<Tul> Tuls { get; set; } = new List<Tul>();
}
