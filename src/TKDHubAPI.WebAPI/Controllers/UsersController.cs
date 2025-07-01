using TKDHubAPI.Application.DTOs.TrainingClass;
using TKDHubAPI.Application.DTOs.User;

namespace TKDHubAPI.WebAPI.Controllers;

/// <summary>
/// API controller for managing users, including creation, retrieval, update, deletion, and registration.
/// Provides endpoints for user management with role-based authorization.
/// </summary>
[Authorize]
public partial class UsersController : BaseApiController
{
    private readonly IUserService _userService;
    private readonly IMapper _mapper;
    private readonly ITrainingClassService _trainingClassService;
    private readonly IPaginationService<UserDto> _paginationService;

    /// <summary>
    /// Initializes a new instance of the <see cref="UsersController"/> class.
    /// </summary>
    /// <param name="userService">The user service instance.</param>
    /// <param name="mapper">The AutoMapper instance.</param>
    /// <param name="logger">The logger instance.</param>
    public UsersController(
        IUserService userService,
        IMapper mapper,
        ILogger<UsersController> logger,
        ITrainingClassService trainingClassService,
        IPaginationService<UserDto> paginationService)
        : base(logger)
    {
        _userService = userService;
        _mapper = mapper;
        _trainingClassService = trainingClassService;
        _paginationService = paginationService;
    }

    /// <summary>
    /// Retrieves all users as UserDto using mapping and returns a paginated, standardized success response.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] int page = 1, [FromQuery] int pageSize = 0)
    {
        var userDtos = await _userService.GetAllWithRolesAsync();
        var paginatedResult = await _paginationService.PaginateAsync(userDtos, page, pageSize);
        return SuccessResponse(paginatedResult);
    }

    /// <summary>
    /// Retrieves a user by their unique identifier.
    /// </summary>
    /// <param name="id">The user ID.</param>
    /// <returns>The user with the specified ID, or NotFound if not found.</returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<User>> Get(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

    /// <summary>
    /// Creates a new user.
    /// </summary>
    /// <param name="createUserDto">The user creation DTO.</param>
    /// <returns>The created user DTO.</returns>
    [HttpPost]
    public async Task<ActionResult<UserDto>> Post([FromBody] CreateUserDto createUserDto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var requestingUserId))
            return Unauthorized("Invalid user context.");

        var currentUserRoles = User.Claims
            .Where(c => c.Type == ClaimTypes.Role)
            .Select(c => c.Value)
            .ToList();

        try
        {
            var userDto = await _userService.CreateUserAsync(requestingUserId, currentUserRoles, createUserDto);
            return CreatedAtAction(nameof(Get), new { id = userDto.Id }, userDto);
        }
        catch (UnauthorizedAccessException ex)
        {
            CustomErrorResponseMiddleware.SetErrorMessage(HttpContext, ex.Message);
            return Forbid();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Updates an existing user.
    /// </summary>
    /// <param name="id">The user ID.</param>
    /// <param name="updateUserDto">The user update DTO.</param>
    /// <returns>The updated user DTO.</returns>
    [HttpPut("{id}")]
    public async Task<ActionResult<UserDto>> Put(int id, [FromBody] CreateUserDto updateUserDto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var requestingUserId))
            return Unauthorized("Invalid user context.");

        var currentUserRoles = User.Claims
            .Where(c => c.Type == ClaimTypes.Role)
            .Select(c => c.Value)
            .ToList();

        try
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            // Use AutoMapper to map the DTO to the existing user entity
            _mapper.Map(updateUserDto, user);

            await _userService.UpdateAsync(user);
            var userDto = _mapper.Map<UserDto>(user);
            return Ok(userDto);
        }
        catch (UnauthorizedAccessException ex)
        {
            CustomErrorResponseMiddleware.SetErrorMessage(HttpContext, ex.Message);
            return Forbid();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Deletes a user by their unique identifier.
    /// </summary>
    /// <param name="id">The user ID.</param>
    /// <returns>No content if successful, or an error response.</returns>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var requestingUserId))
            return Unauthorized("Invalid user context.");

        try
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            await _userService.DeleteAsync(id);
            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            CustomErrorResponseMiddleware.SetErrorMessage(HttpContext, ex.Message);
            return Forbid();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Registers a new user with a password.
    /// </summary>
    /// <param name="dto">The user registration DTO.</param>
    /// <param name="password">The user's password.</param>
    /// <returns>The registered user or an error response.</returns>
    [HttpPost("register")]
    public async Task<IActionResult> Register(CreateUserDto dto, string password)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var requestingUserId))
            return Unauthorized("Invalid user context.");

        var currentUserRoles = User.Claims
            .Where(c => c.Type == ClaimTypes.Role)
            .Select(c => c.Value)
            .ToList();

        var newUserRoleNames = new List<string>();
        foreach (var roleId in dto.RoleIds ?? Enumerable.Empty<int>())
        {
            var roleName = await _userService.GetRoleNameById(roleId);
            if (!string.IsNullOrEmpty(roleName))
                newUserRoleNames.Add(roleName);
        }

        // Students cannot create users
        if (currentUserRoles.Contains("Student") && !currentUserRoles.Contains("Admin") && !currentUserRoles.Contains("Coach"))
        {
            CustomErrorResponseMiddleware.SetErrorMessage(HttpContext, "Students cannot create users.");
            return Forbid();
        }

        // Only Admin can create Admins or Coaches for any dojaang
        if (newUserRoleNames.Any(r => r == "Admin" || r == "Coach"))
        {
            if (!currentUserRoles.Contains("Admin"))
            {
                CustomErrorResponseMiddleware.SetErrorMessage(HttpContext, "Only an Admin can create Admin or Coach users.");
                return Forbid();
            }
        }

        // If current user is Coach (but not Admin), can only create Coach/Student for dojaangs they manage
        if (currentUserRoles.Contains("Coach") && !currentUserRoles.Contains("Admin"))
        {
            if (!newUserRoleNames.All(r => r == "Coach" || r == "Student"))
            {
                CustomErrorResponseMiddleware.SetErrorMessage(HttpContext, "Coach can only create Coach or Student users.");
                return Forbid();
            }

            if (dto.DojaangId == null)
                return BadRequest("DojaangId is required when a coach creates a user.");

            var manages = await _userService.CoachManagesDojaangAsync(requestingUserId, dto.DojaangId.Value);
            if (!manages)
            {
                CustomErrorResponseMiddleware.SetErrorMessage(HttpContext, "Coach can only create users for dojaangs they manage.");
                return Forbid();
            }
        }

        var user = await _userService.RegisterAsync(dto, password);
        if (user == null)
            return BadRequest("User already exists.");

        return Ok(user);
    }

    /// <summary>
    /// Retrieves all <see cref="TrainingClass"/> entities that are imparted by the currently logged-in coach.
    /// Only accessible to users with the "Coach" role.
    /// </summary>
    /// <returns>A list of <see cref="TrainingClassDto"/> representing the classes imparted by the current coach.</returns>  

    [HttpGet("coach/classes")]
    [Authorize(Roles = "Coach")]
    public async Task<ActionResult<IEnumerable<TrainingClassDto>>> GetClassesForCurrentCoach()
    {
        var classes = await _trainingClassService.GetClassesForCurrentCoachAsync();
        return Ok(classes);
    }

    /// <summary>
    /// Reactivates a user by setting their IsActive status to true.
    /// This endpoint allows authorized users to restore a previously deactivated user account.
    /// </summary>
    /// <param name="userId">The unique identifier of the user to reactivate.</param>
    /// <returns>
    /// A standardized success response if the user is reactivated,
    /// or an error response if the user is not found or the operation is unauthorized.
    /// </returns>
    [Authorize(Roles = "Admin")]
    [HttpPost("{userId}/reactivate")]
    public async Task<IActionResult> Reactivate(int userId)
    {
        try
        {
            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
                return ErrorResponse("User not found.", 404);

            await _userService.ReactivateAsync(userId);
            return SuccessResponse(new { Message = "User reactivated." });
        }
        catch (UnauthorizedAccessException ex)
        {
            Logger.LogWarning(ex, "Unauthorized attempt to reactivate user.");
            return ErrorResponse(ex.Message, 403);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error reactivating user");
            return ErrorResponse("An error occurred while reactivating the user.", 500);
        }
    }
}
