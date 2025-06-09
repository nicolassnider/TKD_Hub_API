namespace TKDHubAPI.Domain.Repositories;
/// <summary>
/// Repository interface for UserRole entity with role-specific queries.
/// </summary>
public interface IUserRoleRepository : IGenericRepository<UserRole>
{
    /// <summary>
    /// Gets a list of UserRole entities by their IDs.
    /// </summary>
    Task<List<UserRole>> GetRolesByIdsAsync(IEnumerable<int> roleIds);

    /// <summary>
    /// Gets a UserRole entity by its name.
    /// </summary>
    Task<UserRole?> GetByNameAsync(string name);
}
