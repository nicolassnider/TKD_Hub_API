namespace TKDHubAPI.Application.Interfaces;

/// <summary>
/// Service interface for managing <see cref="StudentClass"/> entities, including retrieval, creation, update, and deletion of student attendance records for training classes.
/// </summary>
public interface IStudentClassService
{
    /// <summary>
    /// Retrieves a <see cref="StudentClass"/> by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the student class attendance record.</param>
    /// <returns>The <see cref="StudentClass"/> if found; otherwise, <c>null</c>.</returns>
    Task<StudentClass> GetByIdAsync(int id);

    /// <summary>
    /// Retrieves all <see cref="StudentClass"/> records for a specific training class.
    /// </summary>
    /// <param name="trainingClassId">The unique identifier of the training class.</param>
    /// <returns>An enumerable collection of <see cref="StudentClass"/> records.</returns>
    Task<IEnumerable<StudentClass>> GetByTrainingClassIdAsync(int trainingClassId);

    /// <summary>
    /// Retrieves all <see cref="StudentClass"/> records for a specific student.
    /// </summary>
    /// <param name="studentId">The unique identifier of the student.</param>
    /// <returns>An enumerable collection of <see cref="StudentClass"/> records.</returns>
    Task<IEnumerable<StudentClass>> GetByStudentIdAsync(int studentId);

    /// <summary>
    /// Creates a new <see cref="StudentClass"/> attendance record.
    /// </summary>
    /// <param name="studentClass">The <see cref="StudentClass"/> entity to create.</param>
    /// <returns>The created <see cref="StudentClass"/> entity.</returns>
    Task<StudentClass> CreateAsync(StudentClass studentClass);

    /// <summary>
    /// Updates an existing <see cref="StudentClass"/> attendance record.
    /// </summary>
    /// <param name="studentClass">The <see cref="StudentClass"/> entity with updated values.</param>
    Task UpdateAsync(StudentClass studentClass);

    /// <summary>
    /// Deletes a <see cref="StudentClass"/> attendance record by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the student class attendance record to delete.</param>
    Task DeleteAsync(int id);
}
