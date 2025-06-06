using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace TKDHubAPI.Application.Services;
public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IUserRepository _userRepository;

    public CurrentUserService(
        IHttpContextAccessor httpContextAccessor,
        IUserRepository userRepository)
    {
        _httpContextAccessor = httpContextAccessor;
        _userRepository = userRepository;
    }

    public async Task<User?> GetCurrentUserAsync()
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            return null;

        if (!int.TryParse(userIdClaim.Value, out int userId))
            return null;

        // Use repository to ensure roles are loaded
        return await _userRepository.GetByIdAsync(userId);
    }
}

