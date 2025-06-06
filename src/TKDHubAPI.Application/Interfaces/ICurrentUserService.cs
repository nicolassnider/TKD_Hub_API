namespace TKDHubAPI.Application.Interfaces;

/// <summary>
/// Provides functionality to retrieve information about the currently authenticated user.
/// </summary>
public interface ICurrentUserService
{
    /// <summary>
    /// Retrieves the current user asynchronously.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation, containing the current User if found; otherwise, null.</returns>
    Task<User?> GetCurrentUserAsync();
}

