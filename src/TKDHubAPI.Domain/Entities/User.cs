using System.ComponentModel.DataAnnotations;

namespace TKDHubAPI.Domain.Entities;
public enum UserRole { Student, Coach, Admin }
public enum Gender { Male, Female, Other }

public class User
{
    public int Id { get; set; }
    [Required, MaxLength(100)]
    public string FirstName { get; set; }
    [Required, MaxLength(100)]
    public string LastName { get; set; }
    [Required, EmailAddress]
    public string Email { get; set; }
    [Required]
    public string PasswordHash { get; set; }
    [Required]
    public UserRole Role { get; set; }
    public DateTime DateOfBirth { get; set; }
    public Gender Gender { get; set; }
    public string PhoneNumber { get; set; }
    public int? DojoId { get; set; }
    public int? CurrentRankId { get; set; }
    public DateTime JoinDate { get; set; }
}
