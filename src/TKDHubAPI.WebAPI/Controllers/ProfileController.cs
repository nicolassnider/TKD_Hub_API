using TKDHubAPI.Application.DTOs.User;

namespace TKDHubAPI.WebAPI.Controllers;

/// <summary>
/// API controller for managing user profile information.
/// Provides enhanced profile data for the logged-in user, including role-specific information.
/// </summary>
[Authorize]
public class ProfileController : BaseApiController
{
    private readonly IUserService _userService;
    private readonly ITrainingClassService _trainingClassService;
    private readonly IMapper _mapper;

    public ProfileController(
        IUserService userService,
        ITrainingClassService trainingClassService,
        IMapper mapper,
        ILogger<ProfileController> logger)
        : base(logger)
    {
        _userService = userService;
        _trainingClassService = trainingClassService;
        _mapper = mapper;
    }

    /// <summary>
    /// Gets the current user's profile with role-specific data.
    /// Returns enhanced profile information based on user roles.
    /// </summary>
    /// <returns>Enhanced profile data for the current user</returns>
    [HttpGet]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetProfile()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
        {
            return ErrorResponse("Invalid user context.", 401);
        }

        try
        {
            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
                return ErrorResponse("User not found.", 404);

            // Map to DTO first
            var userDto = _mapper.Map<UserDto>(user);

            // Create enhanced profile data based on roles
            var profile = new
            {
                id = userDto.Id,
                firstName = userDto.FirstName,
                lastName = userDto.LastName,
                email = userDto.Email,
                phoneNumber = userDto.PhoneNumber,
                dateOfBirth = userDto.DateOfBirth?.ToString("yyyy-MM-dd"),
                dojaangId = userDto.DojaangId,
                dojaangName = user.Dojaang?.Name,
                currentRankId = userDto.CurrentRankId,
                beltLevel = user.CurrentRank?.Name,
                membershipStartDate = userDto.JoinDate?.ToString("yyyy-MM-dd"),
                membershipStatus = userDto.IsActive ? "Active" : "Inactive",
                roles = userDto.Roles,
                managedDojaangIds = userDto.ManagedDojaangIds,
                isActive = userDto.IsActive,
                // Add role-specific data
                managedClasses = userDto.Roles.Contains("Coach")
                    ? await GetManagedClassesForCoach(userId)
                    : null,
                enrolledClass = userDto.Roles.Contains("Student")
                    ? await GetEnrolledClassForStudent(userId)
                    : null,
                attendanceRate = userDto.Roles.Contains("Student")
                    ? await GetAttendanceRateForStudent(userId)
                    : null,
            };

            return SuccessResponse(profile);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error retrieving current user profile.");
            return ErrorResponse("An error occurred while retrieving the profile.", 500);
        }
    }

    /// <summary>
    /// Updates the current user's profile information.
    /// </summary>
    /// <param name="updateData">Profile update data</param>
    /// <returns>Success response if updated successfully</returns>
    [HttpPut]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserDto updateData)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
        {
            return ErrorResponse("Invalid user context.", 401);
        }

        try
        {
            updateData.Id = userId; // Ensure we're updating the current user
            await _userService.UpdateUserFromDtoAsync(userId, updateData);
            return SuccessResponse("Profile updated successfully.");
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error updating user profile.");
            return ErrorResponse("An error occurred while updating the profile.", 500);
        }
    }

    private async Task<object?> GetManagedClassesForCoach(int coachId)
    {
        try
        {
            var classes = await _trainingClassService.GetClassesForCurrentCoachAsync();
            return classes
                ?.Take(3)
                .Select(c => new
                {
                    id = c.Id,
                    name = c.Name,
                    description = c.Description,
                    schedule = c.Schedule,
                    capacity = c.Capacity,
                    enrolledStudents = c.EnrolledStudentsCount,
                });
        }
        catch
        {
            return null;
        }
    }

    private Task<object?> GetEnrolledClassForStudent(int studentId)
    {
        try
        {
            // This would need to be implemented in the TrainingClassService
            // For now, return null as this functionality isn't implemented yet
            return Task.FromResult<object?>(null);
        }
        catch
        {
            return Task.FromResult<object?>(null);
        }
    }

    private Task<double?> GetAttendanceRateForStudent(int studentId)
    {
        try
        {
            // This would need to be implemented to calculate attendance rate
            // For now, return a placeholder value
            return Task.FromResult<double?>(85.0);
        }
        catch
        {
            return Task.FromResult<double?>(null);
        }
    }
}
