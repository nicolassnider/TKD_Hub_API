using TKDHubAPI.Application.DTOs.User;
using TKDHubAPI.Application.Services;

namespace TKDHubAPI.WebAPI.Controllers;

/// <summary>
/// API controller for managing student users.
/// Provides endpoints to create, retrieve, and list students, including filtering by Dojaang.
/// </summary>
[Authorize]
public class StudentsController : BaseApiController
{
    private readonly IStudentService _studentService;
    private readonly ITrainingClassService _trainingClassService;


    /// <summary>
    /// Initializes a new instance of the <see cref="StudentsController"/> class.
    /// </summary>
    /// <param name="studentService">The student service instance.</param>
    /// <param name="mapper">The AutoMapper instance.</param>
    /// <param name="logger">The logger instance.</param>
    public StudentsController(
        IStudentService studentService,
        ITrainingClassService trainingClassService,

        ILogger<StudentsController> logger
    ) : base(logger)
    {
        _studentService = studentService;
        _trainingClassService = trainingClassService;

    }

    /// <summary>
    /// Creates a new student user.
    /// </summary>
    /// <param name="createStudentDto">The student creation DTO.</param>
    /// <returns>The created student user as a <see cref="UserDto"/>.</returns>
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] CreateStudentDto createStudentDto)
    {
        try
        {
            var userDto = await _studentService.CreateStudentAsync(createStudentDto);
            return SuccessResponse(userDto);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error creating student");
            return ErrorResponse(ex.Message, 500);
        }
    }

    /// <summary>
    /// Gets a student by their unique identifier.
    /// </summary>
    /// <param name="id">The student user ID.</param>
    /// <returns>The student user as a <see cref="UserDto"/>, or 404 if not found.</returns>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userDto = await _studentService.GetStudentByIdAsync(id);
        if (userDto == null)
            return ErrorResponse("Student not found", 404);

        return SuccessResponse(userDto);
    }

    /// <summary>
    /// Gets all students.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var students = await _studentService.GetAllStudentsAsync();
        return SuccessResponse(new { data = students });
    }

    /// <summary>
    /// Gets all students for a specific dojaang.
    /// </summary>
    [HttpGet("Dojaang/{dojaangId}")]
    public async Task<IActionResult> GetByDojaang(int dojaangId)
    {
        var students = await _studentService.GetStudentsByDojaangIdAsync(dojaangId);
        return SuccessResponse(new { data = students });
    }

    /// <summary>
    /// Updates an existing student user.
    /// </summary>
    /// <param name="id">The student user ID.</param>
    /// <param name="updateStudentDto">The student update DTO.</param>
    /// <returns>The updated student user as a <see cref="UserDto"/>.</returns>
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] UpdateStudentDto updateStudentDto)
    {
        try
        {
            var updatedStudent = await _studentService.UpdateStudentAsync(id, updateStudentDto);
            if (updatedStudent == null)
                return ErrorResponse("Student not found", 404);

            return SuccessResponse(updatedStudent);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error updating student");
            return ErrorResponse(ex.Message, 500);
        }
    }

    /// <summary>
    /// Adds a student to a training class.
    /// </summary>
    /// <param name="studentId">The unique identifier of the student to add.</param>
    /// <param name="classId">The unique identifier of the training class.</param>
    /// <returns>
    /// A success response if the student was added to the class; otherwise, an error response with details.
    /// </returns>
    /// <remarks>
    /// Returns HTTP 200 on success, or HTTP 400 with an error message if the operation fails.
    /// </remarks>
    [HttpPost("{studentId}/trainingclasses/{classId}")]
    public async Task<IActionResult> AddStudentToClass(int studentId, int classId)
    {
        try
        {
            await _trainingClassService.AddStudentToClassAsync(classId, studentId);
            return SuccessResponse("Student added to class.");
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error adding student to class");
            return ErrorResponse(ex.Message, 400);
        }
    }
}
