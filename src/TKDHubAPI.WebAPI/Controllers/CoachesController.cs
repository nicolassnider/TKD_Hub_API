using MediatR;
using TKDHubAPI.Application.CQRS.Commands.Coaches;
using TKDHubAPI.Application.CQRS.Queries.Coaches;
using TKDHubAPI.Application.DTOs.User;


namespace TKDHubAPI.WebAPI.Controllers;


/// <summary>
/// API controller for managing coach users and their associated dojaangs.
///
/// This controller provides endpoints for:
/// - Creating, retrieving, updating, and deleting coach users
/// - Assigning and removing managed dojaangs for coaches
/// - Upserting (create or update) coach users
/// - Reactivating deactivated coach users
///
/// Only authorized users (admins or coaches with appropriate permissions) can perform these operations.
/// </summary>
[Authorize]
public class CoachesController : BaseApiController
{
    private readonly IUserService _userService;
    private readonly ICoachService _coachService;
    private readonly IMapper _mapper;
    private readonly IMediator _mediator;


    /// <summary>
    /// Initializes a new instance of the <see cref="CoachesController"/> class.
    /// </summary>
    /// <param name="userService">The user service instance.</param>
    /// <param name="coachService">The coach service instance.</param>
    /// <param name="mapper">The AutoMapper instance.</param>
    /// <param name="mediator">The MediatR instance.</param>
    /// <param name="logger">The logger instance.</param>
    public CoachesController(
        IUserService userService,
        ICoachService coachService,
        IMapper mapper,
        IMediator mediator,
        ILogger<CoachesController> logger
    ) : base(logger)
    {
        _userService = userService;
        _coachService = coachService;
        _mapper = mapper;
        _mediator = mediator;
    }


    /// <summary>
    /// Creates a new coach user. Only admins or coaches of the dojaang can add a coach to a dojaang.
    /// </summary>
    /// <param name="createCoachDto">The DTO containing coach creation data.</param>
    /// <returns>A standardized success response with the created coach, or an error response if unauthorized or on failure.</returns>
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] CreateUserDto createCoachDto)
    {
        try
        {
            // Get the current user ID from claims
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var requestingUserId))
                return ErrorResponse("Invalid user context.", 401);


            var command = new CreateCoachCommand
            {
                RequestingUserId = requestingUserId,
                CreateCoachDto = createCoachDto
            };


            var resultDto = await _mediator.Send(command);
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
    /// <param name="id">The unique identifier of the coach.</param>
    /// <returns>A standardized success response with the coach and managed dojaangs, or an error response if not found.</returns>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var query = new GetCoachByIdQuery { Id = id };
        var coach = await _mediator.Send(query);
       
        if (coach == null)
            return ErrorResponse("Coach not found", 404);


        // Get managed dojaangs for this coach
        var managedDojaangs = await _coachService.GetManagedDojaangsAsync(id);


        return SuccessResponse(new
        {
            Coach = coach,
            ManagedDojaangs = managedDojaangs
        });
    }


    /// <summary>
    /// Gets all coaches with pagination.
    /// </summary>
    /// <param name="page">The page number (default: 1).</param>
    /// <param name="pageSize">The page size (default: 0 = use default page size).</param>
    /// <returns>A paginated collection of all coaches with pagination headers.</returns>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 0)
    {
        var query = new GetAllCoachesQuery(page, pageSize);
        var coaches = await _mediator.Send(query);
        return OkWithPagination(coaches);
    }


    /// <summary>
    /// Removes a managed dojaang from a coach.
    /// </summary>
    /// <param name="coachId">The coach's user ID.</param>
    /// <param name="dojaangId">The dojaang ID to remove from management.</param>
    /// <returns>A standardized success response if removed, or an error response if not found or unauthorized.</returns>
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
    /// <param name="coachId">The coach's user ID.</param>
    /// <param name="dto">The DTO containing the updated list of managed dojaang IDs.</param>
    /// <returns>A standardized success response with the updated managed dojaangs, or an error response if IDs do not match or on failure.</returns>
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


    /// <summary>
    /// Creates or updates a coach user (upsert operation).
    /// </summary>
    /// <param name="upsertCoachDto">The DTO containing coach data for upsert.</param>
    /// <returns>A standardized success response with the upserted coach, or an error response if unauthorized or on failure.</returns>
    [HttpPost("upsert")]
    public async Task<IActionResult> Upsert([FromBody] UpsertCoachDto upsertCoachDto)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var requestingUserId))
                return ErrorResponse("Invalid user context.", 401);


            var user = await _userService.UpsertCoachAsync(requestingUserId, upsertCoachDto);
            var resultDto = _mapper.Map<UserDto>(user);
            return SuccessResponse(resultDto);
        }
        catch (UnauthorizedAccessException ex)
        {
            Logger.LogWarning(ex, "Unauthorized attempt to upsert coach.");
            return ErrorResponse(ex.Message, 403);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error upserting coach");
            return ErrorResponse(ex.Message, 500);
        }
    }


    /// <summary>
    /// Deletes a coach by their unique identifier.
    /// </summary>
    /// <param name="coachId">The coach's user ID.</param>
    /// <returns>No content if successful, or an error response if not found or unauthorized.</returns>
    [HttpDelete("{coachId}")]
    public async Task<IActionResult> Delete(int coachId)
    {
        try
        {
            var coach = await _coachService.GetCoachByIdAsync(coachId);
            if (coach == null)
                return ErrorResponse("Coach not found.", 404);


            await _userService.DeleteAsync(coachId);
            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            Logger.LogWarning(ex, "Unauthorized attempt to delete coach.");
            return ErrorResponse(ex.Message, 403);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error deleting coach");
            return ErrorResponse("An error occurred while deleting the coach.", 500);
        }
    }


    [HttpGet("by-dojaang/{dojaangId}")]
    public async Task<IActionResult> GetCoachesByDojaang(int dojaangId)
    {
        var query = new GetCoachesByDojaangQuery { DojaangId = dojaangId };
        var coaches = await _mediator.Send(query);
        return SuccessResponse(coaches);
    }
}
