namespace TKDHubAPI.Domain.Repositories;

/// <summary>
/// Repository interface for managing TrainingClass entities and their related schedules.
/// Provides methods for CRUD operations and schedule conflict checks for coaches.
/// </summary>
public interface ITrainingClassRepository
{
    /// <summary>
    /// Gets a training class by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the training class.</param>
    /// <returns>The training class entity, or null if not found.</returns>
    Task<TrainingClass> GetByIdAsync(int id);

    /// <summary>
    /// Gets all training classes, including related entities.
    /// </summary>
    /// <returns>A collection of all training class entities.</returns>
    Task<IEnumerable<TrainingClass>> GetAllAsync();

    /// <summary>
    /// Adds a new training class to the data store.
    /// </summary>
    /// <param name="entity">The training class entity to add.</param>
    /// <returns>The added training class entity.</returns>
    Task<TrainingClass> AddAsync(TrainingClass entity);

    /// <summary>
    /// Updates an existing training class in the data store.
    /// </summary>
    /// <param name="entity">The training class entity with updated values.</param>
    Task UpdateAsync(TrainingClass entity);

    /// <summary>
    /// Deletes a training class by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the training class to delete.</param>
    Task DeleteAsync(int id);

    /// <summary>
    /// Gets all class schedules for a coach on a specific day, optionally excluding a specific class.
    /// Used to check for schedule conflicts.
    /// </summary>
    /// <param name="coachId">The unique identifier of the coach.</param>
    /// <param name="day">The day of the week to filter schedules.</param>
    /// <param name="excludeClassId">Optional: a class ID to exclude from the results (e.g., when updating).</param>
    /// <returns>A collection of class schedules for the coach on the specified day.</returns>
    Task<IEnumerable<ClassSchedule>> GetSchedulesForCoachOnDayAsync(int coachId, DayOfWeek day, int? excludeClassId = null);

    /// <summary>
    /// Retrieves all <see cref="TrainingClass"/> entities where the specified user is assigned as the coach.
    /// </summary>
    /// <param name="coachId">The unique identifier of the coach.</param>
    /// <returns>An enumerable collection of <see cref="TrainingClass"/> entities coached by the specified user.</returns>
    Task<IEnumerable<TrainingClass>> GetByCoachIdAsync(int coachId);

    /// <summary>
    /// Gets the total count of training classes.
    /// </summary>
    /// <returns>The total number of training classes.</returns>
    Task<int> CountAsync();

    /// <summary>
    /// Gets the most recent training classes.
    /// </summary>
    /// <param name="count">The number of recent classes to retrieve.</param>
    /// <returns>A collection of recent training classes.</returns>
    Task<IEnumerable<TrainingClass>> GetRecentAsync(int count);

    /// <summary>
    /// Gets upcoming training classes.
    /// </summary>
    /// <param name="count">The number of upcoming classes to retrieve.</param>
    /// <returns>A collection of upcoming training classes.</returns>
    Task<IEnumerable<TrainingClass>> GetUpcomingAsync(int count);

    /// <summary>
    /// Gets statistics about training classes.
    /// </summary>
    /// <returns>Statistics object containing class metrics.</returns>
    Task<object> GetStatisticsAsync();
}
