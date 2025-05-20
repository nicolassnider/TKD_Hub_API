using System.ComponentModel.DataAnnotations;
using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.Application.DTOs.User;
public class CreateUserDto
{
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; }

    [Required]
    [MaxLength(100)]
    public string LastName { get; set; }

    [Required]
    [EmailAddress]
    [MaxLength(255)] // Added MaxLength for consistency and to match common email limits
    public string Email { get; set; }

    [Required]
    [MaxLength(20)]
    public string PhoneNumber { get; set; }

    [Required]
    public Gender Gender { get; set; }

    [Required]
    public UserRole Role { get; set; }

    public int? DojaangId { get; set; } // Foreign Key, made nullable to match User entity

    public int? RankId { get; set; } // Foreign Key (Nullable)
}
