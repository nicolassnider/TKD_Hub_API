namespace TKDHubAPI.Domain.Repositories;

/// <summary>
/// Defines repository operations for managing <see cref="StudentClass"/> entities,
/// which represent a student's participation in a specific training class session.
/// </summary>
public interface IStudentClassRepository
{
    /// <summary>
    /// Retrieves a <see cref="StudentClass"/> by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the student class record.</param>
    /// <returns>The student class record with the specified ID, or null if not found.</returns>
    Task<StudentClass> GetByIdAsync(int id);

    /// <summary>
    /// Retrieves all <see cref="StudentClass"/> records for a specific training class.
    /// </summary>
    /// <param name="trainingClassId">The unique identifier of the training class.</param>
    /// <returns>A collection of student class records for the specified training class.</returns>
    Task<IEnumerable<StudentClass>> GetByTrainingClassIdAsync(int trainingClassId);

    /// <summary>
    /// Retrieves all <see cref="StudentClass"/> records for a specific student.
    /// </summary>
    /// <param name="studentId">The unique identifier of the student.</param>
    /// <returns>A collection of student class records for the specified student.</returns>
    Task<IEnumerable<StudentClass>> GetByStudentIdAsync(int studentId);

    /// <summary>
    /// Adds a new <see cref="StudentClass"/> entity to the repository.
    /// </summary>
    /// <param name="entity">The student class record to add.</param>
    /// <returns>The added student class entity.</returns>
    Task<StudentClass> AddAsync(StudentClass entity);

    /// <summary>
    /// Updates an existing <see cref="StudentClass"/> entity in the repository.
    /// </summary>
    /// <param name="entity">The student class record to update.</param>
    Task UpdateAsync(StudentClass entity);

    /// <summary>
    /// Deletes a <see cref="StudentClass"/> entity by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the student class record to delete.</param>
    Task DeleteAsync(int id);
}