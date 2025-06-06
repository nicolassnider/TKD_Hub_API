namespace TKDHubAPI.Domain.Repositories;
/// <summary>
/// Provides repository operations for Tul entities, including retrieval of Tuls with their associated techniques and detailed information.
/// </summary>
public interface ITulRepository : IGenericRepository<Tul>
{
    /// <summary>
    /// Retrieves a collection of Tuls along with their associated techniques asynchronously.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation, containing a collection of Tuls with techniques.</returns>
    Task<IEnumerable<Tul>> GetTulsWithTechniquesAsync();

    /// <summary>
    /// Retrieves a specific Tul by its identifier along with its details asynchronously.
    /// </summary>
    /// <param name="id">The identifier of the Tul to retrieve.</param>
    /// <returns>A task that represents the asynchronous operation, containing the Tul with its details if found; otherwise, null.</returns>
    Task<Tul> GetTulWithDetailsAsync(int id);
}
