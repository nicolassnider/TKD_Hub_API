namespace TKDHubAPI.Domain.Repositories;

/// <summary>
/// Defines repository operations for managing <see cref="ClassSchedule"/> entities.
/// </summary>
public interface IClassScheduleRepository
{
    /// <summary>
    /// Retrieves a <see cref="ClassSchedule"/> by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the class schedule.</param>
    /// <returns>The class schedule with the specified ID, or null if not found.</returns>
    Task<ClassSchedule> GetByIdAsync(int id);

    /// <summary>
    /// Retrieves all <see cref="ClassSchedule"/> entities for a specific training class.
    /// </summary>
    /// <param name="trainingClassId">The unique identifier of the training class.</param>
    /// <returns>A collection of class schedules for the specified training class.</returns>
    Task<IEnumerable<ClassSchedule>> GetByTrainingClassIdAsync(int trainingClassId);

    /// <summary>
    /// Adds a new <see cref="ClassSchedule"/> entity to the repository.
    /// </summary>
    /// <param name="entity">The class schedule to add.</param>
    /// <returns>The added class schedule entity.</returns>
    Task<ClassSchedule> AddAsync(ClassSchedule entity);

    /// <summary>
    /// Updates an existing <see cref="ClassSchedule"/> entity in the repository.
    /// </summary>
    /// <param name="entity">The class schedule to update.</param>
    Task UpdateAsync(ClassSchedule entity);

    /// <summary>
    /// Deletes a <see cref="ClassSchedule"/> entity by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the class schedule to delete.</param>
    Task DeleteAsync(int id);
}