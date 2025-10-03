namespace TKDHubAPI.Application.Interfaces;


/// <summary>
/// Defines a contract for managing students asynchronously, including operations to create a student, retrieve a student by ID, retrieve students by dojaang, and retrieve all students.
/// </summary>
public interface IStudentService
{
    /// <summary>
    /// Creates a new student asynchronously.
    /// </summary>
    /// <param name="createStudentDto">The DTO containing the information required to create a new student.</param>
    /// <returns>A task that represents the asynchronous operation, containing the created UserDto of the student.</returns>
    Task<UserDto> CreateStudentAsync(CreateStudentDto createStudentDto);


    /// <summary>
    /// Retrieves a student by their identifier asynchronously.
    /// </summary>
    /// <param name="id">The identifier of the student to retrieve.</param>
    /// <returns>A task that represents the asynchronous operation, containing the UserDto of the student if found; otherwise, null.</returns>
    Task<UserDto?> GetStudentByIdAsync(int id);


    /// <summary>
    /// Retrieves a list of students associated with a specific dojaang asynchronously.
    /// </summary>
    /// <param name="dojaangId">The identifier of the dojaang whose students are to be retrieved.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of UserDto representing the students associated with the specified dojaang.</returns>
    Task<IEnumerable<UserDto>> GetStudentsByDojaangIdAsync(int dojaangId);


    /// <summary>
    /// Retrieves all students asynchronously.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation, containing a collection of UserDto representing all students.</returns>
    Task<IEnumerable<UserDto>> GetAllStudentsAsync();


    /// <summary>
    /// Retrieves all students who are not enrolled in a specific training class asynchronously.
    /// </summary>
    /// <param name="classId">The identifier of the training class to exclude students from.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of UserDto representing students not enrolled in the specified class.</returns>
    Task<IEnumerable<UserDto>> GetStudentsNotInClassAsync(int classId);


    /// <summary>
    /// Updates an existing student asynchronously.
    /// </summary>
    /// <param name="id">The identifier of the student to update.</param>
    /// <param name="updateStudentDto">The DTO containing the updated information for the student.</param>
    /// <returns>A task that represents the asynchronous operation, containing the updated UserDto of the student if found; otherwise, null.</returns>
    Task<UserDto?> UpdateStudentAsync(int id, UpdateStudentDto updateStudentDto);
}
