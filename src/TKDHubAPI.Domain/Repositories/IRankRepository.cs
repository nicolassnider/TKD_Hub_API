namespace TKDHubAPI.Domain.Repositories;
/// <summary>
/// Provides repository operations for Rank entities, including retrieval of ranks with their associated users.
/// </summary>
public interface IRankRepository : IGenericRepository<Rank>
{
    /// <summary>
    /// Retrieves a collection of ranks along with their associated users asynchronously.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation, containing a collection of ranks with users.</returns>
    Task<IEnumerable<Rank>> GetRanksWithUsersAsync();
}
