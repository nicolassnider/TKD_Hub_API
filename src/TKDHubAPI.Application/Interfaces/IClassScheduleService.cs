namespace TKDHubAPI.Application.Interfaces;

/// <summary>
/// Service interface for managing <see cref="ClassSchedule"/> entities, including retrieval, creation, update, and deletion of class schedules for training classes.
/// </summary>
public interface IClassScheduleService
{
    /// <summary>
    /// Retrieves a <see cref="ClassSchedule"/> by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the class schedule.</param>
    /// <returns>The <see cref="ClassSchedule"/> if found; otherwise, <c>null</c>.</returns>
    Task<ClassSchedule> GetByIdAsync(int id);

    /// <summary>
    /// Retrieves all <see cref="ClassSchedule"/> records for a specific training class.
    /// </summary>
    /// <param name="trainingClassId">The unique identifier of the training class.</param>
    /// <returns>An enumerable collection of <see cref="ClassSchedule"/> records.</returns>
    Task<IEnumerable<ClassSchedule>> GetByTrainingClassIdAsync(int trainingClassId);

    /// <summary>
    /// Creates a new <see cref="ClassSchedule"/> record.
    /// </summary>
    /// <param name="schedule">The <see cref="ClassSchedule"/> entity to create.</param>
    /// <returns>The created <see cref="ClassSchedule"/> entity.</returns>
    Task<ClassSchedule> CreateAsync(ClassSchedule schedule);

    /// <summary>
    /// Updates an existing <see cref="ClassSchedule"/> record.
    /// </summary>
    /// <param name="schedule">The <see cref="ClassSchedule"/> entity with updated values.</param>
    Task UpdateAsync(ClassSchedule schedule);

    /// <summary>
    /// Deletes a <see cref="ClassSchedule"/> record by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the class schedule to delete.</param>
    Task DeleteAsync(int id);
}
