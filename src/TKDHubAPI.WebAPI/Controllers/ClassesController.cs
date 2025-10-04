using MediatR;
using TKDHubAPI.Application.CQRS.Commands.TrainingClasses;
using TKDHubAPI.Application.CQRS.Queries.TrainingClasses;
using TKDHubAPI.Application.DTOs.TrainingClass;
using TKDHubAPI.Application.DTOs.User;

namespace TKDHubAPI.WebAPI.Controllers;

/// <summary>
/// API controller for managing <see cref="TrainingClass"/> entities.
/// </summary>
public class ClassesController : BaseApiController
{
    private readonly ITrainingClassService _trainingClassService;
    private readonly IStudentClassService _studentClassService;
    private readonly IMapper _mapper;
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="ClassesController"/> class.
    /// </summary>
    /// <param name="logger">The logger instance for logging operations.</param>
    /// <param name="trainingClassService">The service for managing training classes.</param>
    /// <param name="studentClassService">The service for managing student-class relationships and attendance.</param>
    /// <param name="mapper">The AutoMapper instance for object mapping.</param>
    /// <param name="mediator">The MediatR instance.</param>
    public ClassesController(
        ILogger<ClassesController> logger,
        ITrainingClassService trainingClassService,
        IMapper mapper,
        IStudentClassService studentClassService,
        IMediator mediator
    )
        : base(logger)
    {
        _trainingClassService = trainingClassService;
        _mapper = mapper;
        _studentClassService = studentClassService;
        _mediator = mediator;
    }

    /// <summary>
    /// Retrieves all training classes.
    /// </summary>
    /// <remarks>
    /// Returns all training classes. Consider applying paging on the client or service layer for large datasets.
    /// </remarks>
    /// <response code="200">Returns the list of training classes</response>
    /// <response code="401">Unauthorized - user not authenticated</response>
    /// <returns>A list of <see cref="TrainingClassDto"/> objects representing all training classes.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(List<TrainingClassDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 0)
    {
        var query = new GetAllTrainingClassesQuery(page, pageSize);
        var classes = await _mediator.Send(query);
        return OkWithPagination(classes);
    }

    /// <summary>
    /// Retrieves a training class by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the training class.</param>
    /// <remarks>
    /// Returns a single training class when it exists; otherwise returns 404.
    /// </remarks>
    /// <response code="200">Returns the training class.</response>
    /// <response code="401">Unauthorized - user not authenticated</response>
    /// <response code="404">Training class not found</response>
    /// <returns>An <see cref="IActionResult"/> containing the <see cref="TrainingClassDto"/> if found.</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(TrainingClassDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var query = new GetTrainingClassByIdQuery { Id = id };
        var trainingClass = await _mediator.Send(query);
        if (trainingClass == null)
            return ErrorResponse("Training class not found.", 404);
        return SuccessResponse(trainingClass);
    }

    /// <summary>
    /// Creates a new training class.
    /// </summary>
    /// <param name="trainingClassDto">The DTO containing the data for the new training class.</param>
    /// <remarks>
    /// Sample request:
    /// {
    ///   "name": "Beginner Class",
    ///   "dojaangId": 1,
    ///   "coachId": 2
    /// }
    /// </remarks>
    /// <response code="200">Returns the created training class.</response>
    /// <response code="400">Bad request - validation or business rule failed.</response>
    /// <response code="401">Unauthorized - user not authenticated.</response>
    /// <returns>An <see cref="IActionResult"/> containing the created <see cref="TrainingClassDto"/>.</returns>
    [HttpPost]
    [ProducesResponseType(typeof(TrainingClassDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Create([FromBody] CreateTrainingClassDto trainingClassDto)
    {
        try
        {
            var command = new CreateTrainingClassCommand
            {
                CreateTrainingClassDto = trainingClassDto
            };
            var result = await _mediator.Send(command);
            return SuccessResponse(result);
        }
        catch (InvalidOperationException ex)
        {
            // Set the error message for the middleware
            CustomErrorResponseMiddleware.SetErrorMessage(HttpContext, ex.Message);
            return StatusCode(400);
        }
    }

    /// <summary>
    /// Updates an existing training class.
    /// </summary>
    /// <param name="id">The unique identifier of the training class to update.</param>
    /// <param name="trainingClassDto">The DTO containing the updated data for the training class.</param>
    /// <response code="200">Update successful.</response>
    /// <response code="400">Bad request - ID mismatch.</response>
    /// <response code="401">Unauthorized - user not authenticated.</response>
    /// <returns>An <see cref="IActionResult"/> indicating the result of the update operation.</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Update(int id, [FromBody] TrainingClassDto trainingClassDto)
    {
        if (id != trainingClassDto.Id)
            return ErrorResponse("ID mismatch.", 400);

        var entity = _mapper.Map<TrainingClass>(trainingClassDto);
        await _trainingClassService.UpdateAsync(entity);
        return SuccessResponse("Training class updated successfully.");
    }

    /// <summary>
    /// Deletes a training class by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the training class to delete.</param>
    /// <response code="200">Delete successful.</response>
    /// <response code="401">Unauthorized - user not authenticated.</response>
    /// <returns>An <see cref="IActionResult"/> indicating the result of the delete operation.</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Delete(int id)
    {
        await _trainingClassService.DeleteAsync(id);
        return SuccessResponse("Training class deleted successfully.");
    }

    /// <summary>
    /// Retrieves all students enrolled in a specific training class.
    /// </summary>
    /// <param name="classId">The unique identifier of the training class.</param>
    /// <response code="200">Returns the list of students for the class.</response>
    /// <response code="401">Unauthorized - user not authenticated.</response>
    /// <returns>A list of <see cref="UserDto"/> objects representing the students in the class.</returns>
    [HttpGet("{classId}/students")]
    [ProducesResponseType(typeof(List<UserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetStudentsByClassId(int classId)
    {
        var students = await _studentClassService.GetStudentsByTrainingClassIdAsync(classId);
        var dtos = students.Select(_mapper.Map<UserDto>).ToList();
        return SuccessResponse(dtos);
    }

    /// <summary>
    /// Retrieves training classes scheduled for a specific day of the week.
    /// If no day is provided, returns classes for today.
    /// </summary>
    /// <param name="day">The day of the week (optional). If not provided, uses today's day.</param>
    /// <response code="200">Returns classes scheduled for the specified day.</response>
    /// <response code="401">Unauthorized - user not authenticated.</response>
    /// <returns>A list of <see cref="TrainingClassDto"/> objects scheduled for the specified day.</returns>
    [HttpGet("by-day")]
    [ProducesResponseType(typeof(List<TrainingClassDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetByDay([FromQuery] DayOfWeek? day = null)
    {
        var targetDay = day ?? DateTime.Today.DayOfWeek;

        var classes = await _trainingClassService.GetAllAsync();
        var filtered = classes
            .Where(c => c.Schedules != null && c.Schedules.Any(s => s.Day == targetDay))
            .ToList();

        var dtos = _mapper.Map<List<TrainingClassDto>>(filtered);
        return SuccessResponse(dtos);
    }

    /// <summary>
    /// Retrieves all training classes given by a specific coach.
    /// </summary>
    /// <param name="coachId">The unique identifier of the coach.</param>
    /// <response code="200">Returns classes given by the coach.</response>
    /// <response code="401">Unauthorized - user not authenticated.</response>
    /// <returns>A list of <see cref="TrainingClassDto"/> objects representing the classes given by the coach.</returns>
    [HttpGet("coach/{coachId}")]
    [ProducesResponseType(typeof(List<TrainingClassDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetByCoachId(int coachId)
    {
        var classes = await _trainingClassService.GetByCoachIdAsync(coachId);
        var dtos = _mapper.Map<List<TrainingClassDto>>(classes);
        return SuccessResponse(dtos);
    }

    /// <summary>
    /// Retrieves all class attendance records for a specific student.
    /// </summary>
    /// <param name="studentId">The unique identifier of the student.</param>
    /// <response code="200">Returns the attendance records for the student.</response>
    /// <response code="401">Unauthorized - user not authenticated.</response>
    /// <returns>A list of <see cref="StudentClassDto"/> records for the student.</returns>
    [HttpGet("student/{studentId}/attendance")]
    [Authorize]
    [ProducesResponseType(typeof(List<StudentClassDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAttendanceByStudentId(int studentId)
    {
        var records = await _studentClassService.GetByStudentIdAsync(studentId);
        var dtos = _mapper.Map<List<StudentClassDto>>(records);
        return SuccessResponse(dtos);
    }

    /// <summary>
    /// Registers an attendance event for a student in a class.
    /// </summary>
    /// <param name="studentClassId">The StudentClass relationship ID.</param>
    /// <param name="request">The attendance registration request.</param>
    /// <response code="200">Attendance registered successfully.</response>
    /// <response code="400">Bad request - validation or business rule failed.</response>
    /// <response code="401">Unauthorized - user not authenticated.</response>
    /// <returns>Success or error response.</returns>
    [HttpPost("student-class/{studentClassId}/attendance")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RegisterAttendance(
        int studentClassId,
        [FromBody] RegisterAttendanceRequest request
    )
    {
        await _trainingClassService.RegisterAttendanceAsync(
            studentClassId,
            request.AttendedAt,
            request.Status,
            request.Notes
        );
        return SuccessResponse("Attendance registered successfully.");
    }

    /// <summary>
    /// Gets attendance history for a student in a class, optionally filtered by date range.
    /// </summary>
    /// <param name="studentClassId">The StudentClass relationship ID.</param>
    /// <param name="request">The attendance history filter request.</param>
    /// <response code="200">Returns attendance history records.</response>
    /// <response code="401">Unauthorized - user not authenticated.</response>
    /// <returns>List of attendance records as DTOs.</returns>
    [HttpGet("student-class/{studentClassId}/attendance-history")]
    [Authorize]
    [ProducesResponseType(typeof(List<AttendanceHistoryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAttendanceHistory(
        int studentClassId,
        [FromQuery] GetAttendanceHistoryRequest request
    )
    {
        var records = await _trainingClassService.GetAttendanceHistoryAsync(
            studentClassId,
            request.From,
            request.To
        );
        var dtos = _mapper.Map<List<AttendanceHistoryDto>>(records);
        return SuccessResponse(dtos);
    }
}
