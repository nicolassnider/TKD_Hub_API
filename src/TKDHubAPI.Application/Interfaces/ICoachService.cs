using TKDHubAPI.Application.DTOs.Dojaang;
using TKDHubAPI.Application.DTOs.User;

namespace TKDHubAPI.Application.Interfaces;
public interface ICoachService
{
    Task<UserDto?> GetCoachByIdAsync(int id);
    Task<IEnumerable<UserDto>> GetAllCoachesAsync();
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
