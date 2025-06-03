using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TKDHubAPI.Application.DTOs.User;
using TKDHubAPI.Application.Interfaces;

namespace TKDHubAPI.WebAPI.Controllers;

/// <summary>
/// API controller for managing student users.
/// Provides endpoints to create, retrieve, and list students, including filtering by Dojaang.
/// </summary>
[Authorize]
public class StudentsController : BaseApiController
{
    private readonly IStudentService _studentService;


    /// <summary>
    /// Initializes a new instance of the <see cref="StudentsController"/> class.
    /// </summary>
    /// <param name="studentService">The student service instance.</param>
    /// <param name="mapper">The AutoMapper instance.</param>
    /// <param name="logger">The logger instance.</param>
    public StudentsController(
        IStudentService studentService,

        ILogger<StudentsController> logger
    ) : base(logger)
    {
        _studentService = studentService;

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
}
