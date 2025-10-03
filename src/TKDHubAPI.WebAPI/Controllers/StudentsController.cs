using MediatR;
using TKDHubAPI.Application.CQRS.Commands.Students;
using TKDHubAPI.Application.CQRS.Queries.Students;
using TKDHubAPI.Application.DTOs.Pagination;
using TKDHubAPI.Application.DTOs.User;


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
    private readonly IMediator _mediator;




    /// <summary>
    /// Initializes a new instance of the <see cref="StudentsController"/> class.
    /// </summary>
    /// <param name="studentService">The student service instance.</param>
    /// <param name="trainingClassService">The training class service instance.</param>
    /// <param name="mediator">The MediatR instance.</param>
    /// <param name="logger">The logger instance.</param>
    public StudentsController(
        IStudentService studentService,
        ITrainingClassService trainingClassService,
        IMediator mediator,
        ILogger<StudentsController> logger
    ) : base(logger)
    {
        _studentService = studentService;
        _trainingClassService = trainingClassService;
        _mediator = mediator;


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
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var requestingUserId))
                return Unauthorized("Invalid user context.");


            var currentUserRoles = GetCurrentUserRoles();


            var command = new CreateStudentCommand
            {
                CreateStudentDto = createStudentDto,
                RequestingUserId = requestingUserId,
                CurrentUserRoles = currentUserRoles
            };

            var userDto = await _mediator.Send(command);
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
        var query = new GetStudentByIdQuery(id);
        var userDto = await _mediator.Send(query);

        if (userDto == null)
            return ErrorResponse("Student not found", 404);


        return SuccessResponse(userDto);
    }


    /// <summary>
    /// Gets all students, optionally excluding students enrolled in a specific class.
    /// </summary>
    /// <param name="excludeClassId">Optional class ID to exclude students who are enrolled in that class.</param>
    /// <summary>
    /// Gets all students with optional filtering, pagination, and sorting.
    /// </summary>
    /// <param name="page">The page number (default: 1).</param>
    /// <param name="pageSize">The page size (default: 0 = use default page size).</param>
    /// <param name="dojaangId">Optional dojang ID to filter students by.</param>
    /// <param name="searchTerm">Optional search term to filter by name or email.</param>
    /// <param name="isActive">Optional filter for active/inactive students.</param>
    /// <param name="rankId">Optional rank ID to filter students by.</param>
    /// <param name="sortBy">Optional field to sort by.</param>
    /// <param name="sortDirection">Sort direction (Ascending or Descending).</param>
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedResult<UserDto>), 200)]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 0,
        [FromQuery] int? excludeClassId = null,
        [FromQuery] int? dojaangId = null,
        [FromQuery] string? searchTerm = null,
        [FromQuery] bool? isActive = null,
        [FromQuery] int? rankId = null,
        [FromQuery] string? sortBy = null,
        [FromQuery] string sortDirection = "Ascending"
    )
    {
        // For now, use the existing query with basic parameters
        // Enhanced filtering can be added to the query handler in future iterations
        var query = new GetAllStudentsQuery(excludeClassId, page, pageSize);
        var students = await _mediator.Send(query);
        return OkWithPagination(students);
    }

    /// <summary>
    /// Gets all students for a specific dojaang.
    /// </summary>
    [HttpGet("Dojaang/{dojaangId}")]
    public async Task<IActionResult> GetByDojaang(int dojaangId)
    {
        var query = new GetStudentsByDojaangIdQuery(dojaangId);
        var students = await _mediator.Send(query);
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
            var command = new UpdateStudentCommand
            {
                Id = id,
                UpdateStudentDto = updateStudentDto
            };

            var updatedStudent = await _mediator.Send(command);
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


    /// <summary>
    /// Removes a student from a training class.
    /// </summary>
    /// <param name="studentId">The ID of the student to remove from the class.</param>
    /// <param name="classId">The ID of the training class to remove the student from.</param>
    /// <returns>
    /// An <see cref="IActionResult"/> indicating the success or failure of the operation.
    /// </returns>
    /// <remarks>
    /// Returns HTTP 200 on success, or HTTP 400 with an error message if the operation fails.
    /// </remarks>
    [HttpDelete("{studentId}/trainingclasses/{classId}")]
    public async Task<IActionResult> RemoveStudentFromClass(int studentId, int classId)
    {
        try
        {
            await _trainingClassService.RemoveStudentFromClassAsync(classId, studentId);
            return SuccessResponse("Student removed from class.");
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error removing student from class");
            return ErrorResponse(ex.Message, 400);
        }
    }
}
