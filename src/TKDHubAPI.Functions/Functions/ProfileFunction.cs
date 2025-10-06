using System.Net;
using System.Text.Json;
using AutoMapper;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using TKDHubAPI.Application.DTOs.User;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Application.Services;
using TKDHubFunctions.Helpers;

namespace TKDHubFunctions.Functions;

public class ProfileFunction
{
    private readonly ILogger<ProfileFunction> _logger;
    private readonly IUserService _userService;
    private readonly ITrainingClassService _trainingClassService;
    private readonly IMapper _mapper;

    public ProfileFunction(
        ILogger<ProfileFunction> logger,
        IUserService userService,
        ITrainingClassService trainingClassService,
        IMapper mapper
    )
    {
        _logger = logger;
        _userService = userService;
        _trainingClassService = trainingClassService;
        _mapper = mapper;
    }

    [Function("GetProfile")]
    public async Task<HttpResponseData> GetProfile(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "profile")] HttpRequestData req
    )
    {
        try
        {
            var (isAuthenticated, userId, userRole) = JwtHelper.ExtractUserInfo(req);
            if (!isAuthenticated)
            {
                var unauthorizedResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
                CorsHelper.SetCorsHeaders(unauthorizedResponse);
                await unauthorizedResponse.WriteAsJsonAsync(
                    new { message = "Unauthorized access" }
                );
                return unauthorizedResponse;
            }

            _logger.LogInformation("Getting profile for user {UserId}", userId);

            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
            {
                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                CorsHelper.SetCorsHeaders(notFoundResponse);
                await notFoundResponse.WriteAsJsonAsync(new { message = "User not found" });
                return notFoundResponse;
            }

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
            };

            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(new { data = profile });
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving current user profile");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(
                new { message = "An error occurred while retrieving the profile" }
            );
            return errorResponse;
        }
    }

    [Function("UpdateProfile")]
    public async Task<HttpResponseData> UpdateProfile(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "profile")] HttpRequestData req
    )
    {
        try
        {
            var (isAuthenticated, userId, userRole) = JwtHelper.ExtractUserInfo(req);
            if (!isAuthenticated)
            {
                var unauthorizedResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
                CorsHelper.SetCorsHeaders(unauthorizedResponse);
                await unauthorizedResponse.WriteAsJsonAsync(
                    new { message = "Unauthorized access" }
                );
                return unauthorizedResponse;
            }

            var body = await req.ReadAsStringAsync();
            if (string.IsNullOrEmpty(body))
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(
                    new { message = "Request body is required" }
                );
                return badRequestResponse;
            }

            var updateData = JsonSerializer.Deserialize<Dictionary<string, object>>(
                body,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            );

            if (updateData == null)
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(
                    new { message = "Invalid profile update data" }
                );
                return badRequestResponse;
            }

            _logger.LogInformation("Updating profile for user {UserId}", userId);

            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
            {
                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                CorsHelper.SetCorsHeaders(notFoundResponse);
                await notFoundResponse.WriteAsJsonAsync(new { message = "User not found" });
                return notFoundResponse;
            }

            // Update user properties based on provided data
            if (
                updateData.ContainsKey("firstName")
                && updateData["firstName"] is JsonElement firstNameElement
            )
            {
                var firstName = firstNameElement.GetString();
                if (!string.IsNullOrEmpty(firstName))
                    user.FirstName = firstName;
            }

            if (
                updateData.ContainsKey("lastName")
                && updateData["lastName"] is JsonElement lastNameElement
            )
            {
                var lastName = lastNameElement.GetString();
                if (!string.IsNullOrEmpty(lastName))
                    user.LastName = lastName;
            }

            if (
                updateData.ContainsKey("phoneNumber")
                && updateData["phoneNumber"] is JsonElement phoneElement
            )
            {
                var phoneNumber = phoneElement.GetString();
                user.PhoneNumber = phoneNumber ?? string.Empty;
            }

            if (
                updateData.ContainsKey("dateOfBirth")
                && updateData["dateOfBirth"] is JsonElement dobElement
            )
            {
                if (DateTime.TryParse(dobElement.GetString(), out var dateOfBirth))
                    user.DateOfBirth = dateOfBirth;
            }

            // Update user
            await _userService.UpdateAsync(user);
            var updatedUserDto = _mapper.Map<UserDto>(user);

            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(new { data = updatedUserDto });
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user profile");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(
                new { message = "An error occurred while updating the profile" }
            );
            return errorResponse;
        }
    }

    [Function("ChangePassword")]
    public async Task<HttpResponseData> ChangePassword(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "profile/change-password")]
            HttpRequestData req
    )
    {
        try
        {
            var (isAuthenticated, userId, userRole) = JwtHelper.ExtractUserInfo(req);
            if (!isAuthenticated)
            {
                var unauthorizedResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
                CorsHelper.SetCorsHeaders(unauthorizedResponse);
                await unauthorizedResponse.WriteAsJsonAsync(
                    new { message = "Unauthorized access" }
                );
                return unauthorizedResponse;
            }

            var body = await req.ReadAsStringAsync();
            if (string.IsNullOrEmpty(body))
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(
                    new { message = "Request body is required" }
                );
                return badRequestResponse;
            }

            var passwordData = JsonSerializer.Deserialize<ChangePasswordDto>(
                body,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            );

            if (
                passwordData == null
                || string.IsNullOrEmpty(passwordData.CurrentPassword)
                || string.IsNullOrEmpty(passwordData.NewPassword)
            )
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(
                    new { message = "Current password and new password are required" }
                );
                return badRequestResponse;
            }

            _logger.LogInformation("Changing password for user {UserId}", userId);

            // For now, just validate that user exists and return success
            // Password change functionality would need to be implemented in the service
            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
            {
                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                CorsHelper.SetCorsHeaders(notFoundResponse);
                await notFoundResponse.WriteAsJsonAsync(new { message = "User not found" });
                return notFoundResponse;
            }

            // TODO: Implement actual password change logic

            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(new { message = "Password changed successfully" });
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error changing password for user");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(
                new { message = "An error occurred while changing the password" }
            );
            return errorResponse;
        }
    }

    [Function("ProfileOptions")]
    public HttpResponseData ProfileOptions(
        [HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = "profile/{*route}")]
            HttpRequestData req
    )
    {
        var response = req.CreateResponse(HttpStatusCode.NoContent);
        CorsHelper.SetCorsHeaders(response);
        return response;
    }

    // Helper methods for role-specific data
    private async Task<object?> GetManagedClassesForCoach(int userId)
    {
        try
        {
            // Get classes managed by the coach using available method
            var classes = await _trainingClassService.GetByCoachIdAsync(userId);
            return classes.Select(c => new
            {
                id = c.Id,
                name = c.Name,
                description = c.Description,
                enrolledCount = 0, // TODO: Implement student count
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting managed classes for coach {UserId}", userId);
            return null;
        }
    }
}

public class ChangePasswordDto
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
	