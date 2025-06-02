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
    private readonly ICoachService _coachService;
    private readonly IMapper _mapper;

    public CoachesController(
        IUserService userService,
        ICoachService coachService,
        IMapper mapper,
        ILogger<CoachesController> logger
    ) : base(logger)
    {
        _userService = userService;
        _coachService = coachService;
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
    /// Gets a coach by ID, including managed dojaangs.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var user = await _coachService.GetCoachByIdAsync(id);
        if (user == null)
            return ErrorResponse("Coach not found", 404);

        var resultDto = _mapper.Map<UserDto>(user);

        // Get managed dojaangs for this coach
        var managedDojaangs = await _coachService.GetManagedDojaangsAsync(id);

        return SuccessResponse(new
        {
            Coach = resultDto,
            ManagedDojaangs = managedDojaangs
        });
    }

    /// <summary>
    /// Gets all coaches.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _coachService.GetAllCoachesAsync();
        var result = users.Select(_mapper.Map<UserDto>);
        return SuccessResponse(result);
    }

    /// <summary>
    /// Removes a managed dojaang from a coach.
    /// </summary>
    [HttpDelete("{coachId}/dojaangs/{dojaangId}")]
    public async Task<IActionResult> RemoveManagedDojaang(int coachId, int dojaangId)
    {
        try
        {
            await _coachService.RemoveManagedDojaangAsync(coachId, dojaangId);
            return SuccessResponse(new { Message = "Managed dojaang removed from coach." });
        }
        catch (KeyNotFoundException ex)
        {
            return ErrorResponse(ex.Message, 404);
        }
        catch (UnauthorizedAccessException ex)
        {
            return ErrorResponse(ex.Message, 403);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error removing managed dojaang from coach");
            return ErrorResponse("An error occurred while removing the managed dojaang.", 500);
        }
    }

    /// <summary>
    /// Updates the list of managed dojaangs for a coach.
    /// </summary>
    [HttpPut("{coachId}/managed-dojaangs")]
    public async Task<IActionResult> UpdateManagedDojaangs(int coachId, [FromBody] UpdateCoachManagedDojaangsDto dto)
    {
        if (coachId != dto.CoachId)
            return ErrorResponse("Coach ID in URL and body do not match.", 400);

        try
        {
            // Get current managed dojaang IDs
            var currentManagedIds = await _userService.GetManagedDojaangIdsAsync(coachId);

            // Only add new managed dojaangs not already managed
            var toAdd = dto.ManagedDojaangIds.Except(currentManagedIds).ToList();
            foreach (var dojaangId in toAdd)
            {
                // Implement AddManagedDojaangAsync in your service if not already present
                await _coachService.AddManagedDojaangAsync(coachId, dojaangId);
            }

            // Return updated managed dojaangs
            var updatedManagedDojaangs = await _coachService.GetManagedDojaangsAsync(coachId);
            return SuccessResponse(new
            {
                CoachId = coachId,
                ManagedDojaangs = updatedManagedDojaangs
            });
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error updating managed dojaangs for coach");
            return ErrorResponse("An error occurred while updating managed dojaangs.", 500);
        }
    }
}
