namespace TKDHubAPI.Domain.Repositories;
/// <summary>
/// Repository interface for User entity with user-specific queries.
/// </summary>
public interface IUserRepository : IGenericRepository<User>
{
    Task<User?> GetUserByEmailAsync(string email);
    Task<User?> GetUserByPhoneNumberAsync(string phoneNumber);
    Task<IEnumerable<User>> GetUsersByGenderAsync(Gender gender);
    Task<IEnumerable<User>> GetUsersByRoleAsync(string roleName);

    /// <summary>
    /// Gets all users with the Student role for a specific dojaang.
    /// </summary>
    Task<IEnumerable<User>> GetStudentsByDojaangIdAsync(int dojaangId);
}
