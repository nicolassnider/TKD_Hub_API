using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace TKDHubAPI.Application.Services;
public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IGenericRepository<User> _userRepository;

    public CurrentUserService(
        IHttpContextAccessor httpContextAccessor,
        IGenericRepository<User> userRepository)
    {
        _httpContextAccessor = httpContextAccessor;
        _userRepository = userRepository;
    }

    public User? GetCurrentUser()
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            return null;

        int userId = int.Parse(userIdClaim.Value);
        // Synchronously for simplicity; consider making this async if needed
        return _userRepository.GetByIdAsync(userId).GetAwaiter().GetResult();
    }
}
