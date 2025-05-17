using System.ComponentModel.DataAnnotations;

namespace TKDHubAPI.Domain.Entities;
public class Rank
{
    public enum BeltColor
    {
        White,
        Yellow,
        Green,
        Blue,
        Red,
        Black
    }

    public int Id { get; set; }

    [Required, MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    public int Order { get; set; }

    public string Description { get; set; } = string.Empty;

    // Main belt color
    public BeltColor Color { get; set; }

    // Stripe color (null if no stripe)
    public BeltColor? StripeColor { get; set; }

    // Dan level for black belts (null for color belts)
    public int? DanLevel { get; set; }
}