namespace TKDHubAPI.Application.Interfaces;
public interface ICurrentUserService
{
    Task<User?> GetCurrentUserAsync();
}
