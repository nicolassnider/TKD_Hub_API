namespace TKDHubAPI.Domain.Repositories;

/// <summary>
/// Defines generic repository operations for entities of type <typeparamref name="TEntity"/>, including asynchronous retrieval, addition, update, and removal.
/// </summary>
public interface IGenericRepository<TEntity>
    where TEntity : class
{
    /// <summary>
    /// Retrieves all entities of type TEntity asynchronously.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation, containing a collection of TEntity.</returns>
    Task<IEnumerable<TEntity>> GetAllAsync();

    /// <summary>
    /// Retrieves a specific entity by its identifier asynchronously.
    /// </summary>
    /// <param name="id">The identifier of the entity to retrieve.</param>
    /// <returns>A task that represents the asynchronous operation, containing the TEntity if found; otherwise, null.</returns>
    Task<TEntity?> GetByIdAsync(int id);

    /// <summary>
    /// Adds a new entity of type TEntity asynchronously.
    /// </summary>
    /// <param name="entity">The entity to add.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task AddAsync(TEntity entity);

    /// <summary>
    /// Updates an existing entity of type TEntity.
    /// </summary>
    /// <param name="entity">The entity with updated values.</param>
    void Update(TEntity entity);

    /// <summary>
    /// Removes a specific entity of type TEntity.
    /// </summary>
    /// <param name="entity">The entity to remove.</param>
    void Remove(TEntity entity);
}
