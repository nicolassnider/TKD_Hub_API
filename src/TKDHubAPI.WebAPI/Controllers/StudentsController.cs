using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TKDHubAPI.Application.DTOs.User;
using TKDHubAPI.Application.Interfaces;

namespace TKDHubAPI.WebAPI.Controllers;

public class StudentsController : BaseApiController
{
    private readonly IUserService _userService;
    private readonly IMapper _mapper;

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
    /// Gets a student by ID.
    /// </summary>
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
