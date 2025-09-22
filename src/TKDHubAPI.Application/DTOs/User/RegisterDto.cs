namespace TKDHubAPI.Application.DTOs.User;

/// <summary>
/// DTO for public user registration.
/// </summary>
[ExcludeFromCodeCoverage]
public class RegisterDto
{
    /// <summary>
    /// The user's first name.
    /// </summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// The user's last name.
    /// </summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// The user's email address (will be used as username).
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// The user's password.
    /// </summary>
    public string Password { get; set; } = string.Empty;

    /// <summary>
    /// The user's phone number (optional).
    /// </summary>
    public string? PhoneNumber { get; set; }

    /// <summary>
    /// The user's date of birth (optional).
    /// </summary>
    public DateTime? DateOfBirth { get; set; }

    /// <summary>
    /// The dojaang the user wants to join (optional).
    /// </summary>
    public int? DojaangId { get; set; }
}
