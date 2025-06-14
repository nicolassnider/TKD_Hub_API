namespace TKDHubAPI.Application.Interfaces;

/// <summary>
/// Provides methods for managing coach entities, including retrieval of coaches, management of associated dojaangs, and assignment or removal of managed dojaangs.
/// </summary>
public interface ICoachService
{
    /// <summary>
    /// Retrieves a coach by their identifier asynchronously.
    /// </summary>
    /// <param name="id">The identifier of the coach to retrieve.</param>
    /// <returns>A task that represents the asynchronous operation, containing the UserDto of the coach if found; otherwise, null.</returns>
    Task<UserDto?> GetCoachByIdAsync(int id);

    /// <summary>
    /// Retrieves all coaches asynchronously.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation, containing a collection of UserDto representing all coaches.</returns>
    Task<IEnumerable<UserDto>> GetAllCoachesAsync();

    /// <summary>
    /// Retrieves a list of dojaangs managed by a specific coach asynchronously.
    /// </summary>
    /// <param name="coachId">The identifier of the coach whose managed dojaangs are to be retrieved.</param>
    /// <returns>A task that represents the asynchronous operation, containing a list of ManagedDojaangDto associated with the coach.</returns>
    Task<List<ManagedDojaangDto>> GetManagedDojaangsAsync(int coachId);

    /// <summary>
    /// Removes the association between a coach and a managed dojaang.
    /// </summary>
    /// <param name="coachId">The coach's user ID.</param>
    /// <param name="dojaangId">The dojaang ID to remove from management.</param>
    Task RemoveManagedDojaangAsync(int coachId, int dojaangId);

    /// <summary>
    /// Adds a managed dojaang to a coach if not already present.
    /// </summary>
    /// <param name="coachId">The coach's user ID.</param>
    /// <param name="dojaangId">The dojaang ID to add to management.</param>
    Task AddManagedDojaangAsync(int coachId, int dojaangId);
}
