using TKDHubAPI.Application.DTOs.TrainingClass;

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

    /// <summary>
    /// Checks if a coach has a schedule conflict with the given schedules.
    /// </summary>
    /// <param name="coachId">The coach's user ID.</param>
    /// <param name="schedules">The schedules to check.</param>
    /// <param name="excludeClassId">Optional: exclude a class (for updates).</param>
    /// <returns>True if there is a conflict, otherwise false.</returns>
    Task<bool> HasCoachScheduleConflictAsync(int coachId, IEnumerable<ClassSchedule> schedules, int? excludeClassId = null);

    /// <summary>
    /// Retrieves all <see cref="TrainingClassDto"/> entities that are imparted by the currently logged-in coach.
    /// Only classes where the current user is assigned as the coach are returned.
    /// </summary>
    /// <returns>An enumerable collection of <see cref="TrainingClassDto"/> for the current coach, or an empty collection if the user is not a coach or not authenticated.</returns>
    Task<IEnumerable<TrainingClassDto>> GetClassesForCurrentCoachAsync();

    /// <summary>
    /// Adds a student to a training class.
    /// </summary>
    /// <param name="trainingClassId">The unique identifier of the training class.</param>
    /// <param name="studentId">The unique identifier of the student to add.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    /// <exception cref="KeyNotFoundException">Thrown if the training class or student does not exist.</exception>
    /// <exception cref="InvalidOperationException">Thrown if the student is already enrolled in the class.</exception>
    Task AddStudentToClassAsync(int trainingClassId, int studentId);
}
