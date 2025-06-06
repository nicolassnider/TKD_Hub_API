namespace TKDHubAPI.Application.Interfaces;

/// <summary>
/// Defines generic asynchronous CRUD (Create, Read, Update, Delete) operations for entities of type <typeparamref name="TEntity"/>.
/// </summary>
public interface ICrudService<TEntity>
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
    /// Updates an existing entity of type TEntity asynchronously.
    /// </summary>
    /// <param name="entity">The entity with updated values.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task UpdateAsync(TEntity entity);

    /// <summary>
    /// Deletes a specific entity by its identifier asynchronously.
    /// </summary>
    /// <param name="id">The identifier of the entity to delete.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task DeleteAsync(int id);
}
