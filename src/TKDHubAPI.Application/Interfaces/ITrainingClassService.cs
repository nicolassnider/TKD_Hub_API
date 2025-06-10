namespace TKDHubAPI.Application.Services;

/// <summary>
/// Service interface for managing <see cref="TrainingClass"/> entities, including retrieval, creation, update, and deletion.
/// </summary>
public interface ITrainingClassService
{
    /// <summary>
    /// Retrieves a <see cref="TrainingClass"/> by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the training class.</param>
    /// <returns>The <see cref="TrainingClass"/> if found; otherwise, <c>null</c>.</returns>
    Task<TrainingClass> GetByIdAsync(int id);

    /// <summary>
    /// Retrieves all <see cref="TrainingClass"/> entities.
    /// </summary>
    /// <returns>An enumerable collection of <see cref="TrainingClass"/>.</returns>
    Task<IEnumerable<TrainingClass>> GetAllAsync();

    /// <summary>
    /// Creates a new <see cref="TrainingClass"/>.
    /// </summary>
    /// <param name="trainingClass">The <see cref="TrainingClass"/> entity to create.</param>
    /// <returns>The created <see cref="TrainingClass"/> entity.</returns>
    Task<TrainingClass> CreateAsync(TrainingClass trainingClass);

    /// <summary>
    /// Updates an existing <see cref="TrainingClass"/>.
    /// </summary>
    /// <param name="trainingClass">The <see cref="TrainingClass"/> entity with updated values.</param>
    Task UpdateAsync(TrainingClass trainingClass);

    /// <summary>
    /// Deletes a <see cref="TrainingClass"/> by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the training class to delete.</param>
    Task DeleteAsync(int id);
}
