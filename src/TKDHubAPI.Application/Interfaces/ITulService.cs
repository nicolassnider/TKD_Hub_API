namespace TKDHubAPI.Application.Interfaces;

/// <summary>
/// Defines a contract for managing Tuls asynchronously, including operations to retrieve, add, update, and delete Tuls.
/// </summary>
public interface ITulService
{
    /// <summary>
    /// Retrieves all Tuls asynchronously.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation, containing a collection of Tuls.</returns>
    Task<IEnumerable<Tul>> GetAllAsync();

    /// <summary>
    /// Retrieves a specific Tul by its identifier asynchronously.
    /// </summary>
    /// <param name="id">The identifier of the Tul to retrieve.</param>
    /// <returns>A task that represents the asynchronous operation, containing the Tul if found; otherwise, null.</returns>
    Task<Tul?> GetByIdAsync(int id);

    /// <summary>
    /// Adds a new Tul asynchronously.
    /// </summary>
    /// <param name="tul">The Tul to add.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task AddAsync(Tul tul);

    /// <summary>
    /// Updates an existing Tul asynchronously.
    /// </summary>
    /// <param name="tul">The Tul with updated values.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task UpdateAsync(Tul tul);

    /// <summary>
    /// Deletes a specific Tul by its identifier asynchronously.
    /// </summary>
    /// <param name="id">The identifier of the Tul to delete.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task DeleteAsync(int id);
}
