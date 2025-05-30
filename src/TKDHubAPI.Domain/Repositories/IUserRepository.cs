namespace TKDHubAPI.Domain.Repositories;
/// <summary>
/// Repository interface for User entity with user-specific queries.
/// </summary>
public interface IUserRepository : IGenericRepository<User>
{
    /// <summary>
    /// Gets user by it specific email.
    /// </summary>
    Task<User?> GetUserByEmailAsync(string email);

    /// <summary>
    /// Gets user by it specific phone.
    /// </summary>
    Task<User?> GetUserByPhoneNumberAsync(string phoneNumber);

    /// <summary>
    /// Gets all users with the Student by gender.
    /// </summary>
    Task<IEnumerable<User>> GetUsersByGenderAsync(Gender gender);

    /// <summary>
    /// Gets all users by role.
    /// </summary>
    Task<IEnumerable<User>> GetUsersByRoleAsync(string roleName);

    /// <summary>
    /// Gets all users by dojaag.
    /// </summary>
    Task<IEnumerable<User>> GetStudentsByDojaangIdAsync(int dojaangId);
}
