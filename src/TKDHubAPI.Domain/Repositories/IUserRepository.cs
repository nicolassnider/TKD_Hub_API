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


    /// <summary>
    /// Gets the IDs of students enrolled in a specific training class.
    /// </summary>
    /// <param name="classId">The ID of the training class.</param>
    /// <returns>A collection of student user IDs enrolled in the class.</returns>
    Task<IEnumerable<int>> GetStudentIdsByClassIdAsync(int classId);


    /// <summary>
    /// Gets all UserUserRoles for a user.
    /// </summary>
    Task<IEnumerable<UserUserRole>> GetUserUserRolesAsync(int userId);


    /// <summary>
    /// Adds a UserUserRole association.
    /// </summary>
    Task AddUserUserRoleAsync(UserUserRole userUserRole);


    /// <summary>
    /// Removes a UserUserRole association.
    /// </summary>
    Task RemoveUserUserRoleAsync(int userId, int userRoleId);
}
