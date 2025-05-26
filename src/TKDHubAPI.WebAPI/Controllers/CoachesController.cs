using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TKDHubAPI.Application.DTOs.User;
using TKDHubAPI.Application.Interfaces;

namespace TKDHubAPI.WebAPI.Controllers;

[Authorize]
public class CoachesController : BaseApiController
{
    private readonly IUserService _userService;
    private readonly IMapper _mapper;

    public CoachesController(
        IUserService userService,
        IMapper mapper,
        ILogger<CoachesController> logger
    ) : base(logger)
    {
        _userService = userService;
        _mapper = mapper;
    }

    /// <summary>
    /// Creates a new coach user. Only admins or coaches of the dojaang can add a coach to a dojaang.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] CreateUserDto createCoachDto)
    {
        try
        {
            // Get the current user ID from claims
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var requestingUserId))
                return ErrorResponse("Invalid user context.", 401);

            // Use the new service method to enforce business rules
            var user = await _userService.AddCoachToDojaangAsync(requestingUserId, createCoachDto);
            var resultDto = _mapper.Map<UserDto>(user);
            return SuccessResponse(resultDto);
        }
        catch (UnauthorizedAccessException ex)
        {
            Logger.LogWarning(ex, "Unauthorized attempt to add coach.");
            return ErrorResponse(ex.Message, 403);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error creating coach");
            return ErrorResponse(ex.Message, 500);
        }
    }

    /// <summary>
    /// Gets a coach by ID.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
            return ErrorResponse("Coach not found", 404);

        var resultDto = _mapper.Map<UserDto>(user);
        return SuccessResponse(resultDto);
    }

    /// <summary>
    /// Gets all coaches.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userService.GetUsersByRoleAsync("Coach");
        var result = users.Select(_mapper.Map<UserDto>);
        return SuccessResponse(result);
    }
}
