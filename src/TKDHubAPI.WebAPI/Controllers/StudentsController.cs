using AutoMapper;
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
    private readonly IUserService _userService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="StudentsController"/> class.
    /// </summary>
    /// <param name="userService">The user service instance.</param>
    /// <param name="mapper">The AutoMapper instance.</param>
    /// <param name="logger">The logger instance.</param>
    public StudentsController(
        IUserService userService,
        IMapper mapper,
        ILogger<StudentsController> logger
    ) : base(logger)
    {
        _userService = userService;
        _mapper = mapper;
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
            var user = await _userService.AddUserWithRolesAsync(createStudentDto);
            var resultDto = _mapper.Map<UserDto>(user);
            return SuccessResponse(resultDto);
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
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
            return ErrorResponse("Student not found", 404);

        var resultDto = _mapper.Map<UserDto>(user);
        return SuccessResponse(resultDto);
    }
}
