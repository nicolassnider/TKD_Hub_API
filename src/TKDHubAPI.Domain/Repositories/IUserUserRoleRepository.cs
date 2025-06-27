namespace TKDHubAPI.Domain.Repositories;

/// <summary>
/// Repository interface for UserUserRole entity with user-role association queries.
/// </summary>
public interface IUserUserRoleRepository : IGenericRepository<UserUserRole>
{
    /// <summary>
    /// Gets all UserUserRole associations for a user.
    /// </summary>
    Task<IEnumerable<UserUserRole>> GetByUserIdAsync(int userId);

    /// <summary>
    /// Checks if a user has a specific role.
    /// </summary>
    Task<bool> UserHasRoleAsync(int userId, int userRoleId);

    /// <summary>
    /// Adds a UserUserRole association.
    /// </summary>
    Task AddUserUserRoleAsync(UserUserRole userUserRole);

    /// <summary>
    /// Removes a UserUserRole association.
    /// </summary>
    Task RemoveUserUserRoleAsync(int userId, int userRoleId);
}
