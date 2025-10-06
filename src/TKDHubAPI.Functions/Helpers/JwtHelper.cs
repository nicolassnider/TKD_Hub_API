using Microsoft.Azure.Functions.Worker.Http;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace TKDHubFunctions.Helpers;

public static class JwtHelper
{
    public static (bool IsAuthenticated, int UserId, string UserRole) ExtractUserInfo(HttpRequestData req)
    {
        try
        {
            var authHeader = req.Headers.FirstOrDefault(h => h.Key.Equals("Authorization", StringComparison.OrdinalIgnoreCase));
            if (!authHeader.Value.Any())
            {
                return (false, 0, string.Empty);
            }

            var token = authHeader.Value.First()?.Replace("Bearer ", "", StringComparison.OrdinalIgnoreCase);
            if (string.IsNullOrEmpty(token))
            {
                return (false, 0, string.Empty);
            }

            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadJwtToken(token);

            var userIdClaim = jsonToken.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier || x.Type == "sub");
            var roleClaim = jsonToken.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role || x.Type == "role");

            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return (false, 0, string.Empty);
            }

            var userRole = roleClaim?.Value ?? string.Empty;
            return (true, userId, userRole);
        }
        catch
        {
            return (false, 0, string.Empty);
        }
    }

    public static bool IsInRole(HttpRequestData req, string requiredRole)
    {
        var (isAuthenticated, userId, userRole) = ExtractUserInfo(req);
        return isAuthenticated && userRole.Equals(requiredRole, StringComparison.OrdinalIgnoreCase);
    }

    public static bool IsInAnyRole(HttpRequestData req, params string[] requiredRoles)
    {
        var (isAuthenticated, userId, userRole) = ExtractUserInfo(req);
        return isAuthenticated && requiredRoles.Any(role => userRole.Equals(role, StringComparison.OrdinalIgnoreCase));
    }
}
