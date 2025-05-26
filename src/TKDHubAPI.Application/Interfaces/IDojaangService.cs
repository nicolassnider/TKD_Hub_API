using TKDHubAPI.Application.DTOs.Dojaang;

namespace TKDHubAPI.Application.Interfaces;
public interface IDojaangService : ICrudService<Dojaang>
{
    /// <summary>
    /// Creates a new dojaang. Only admins are allowed to perform this action.
    /// </summary>
    /// <param name="dto">The dojaang creation DTO.</param>
    /// <param name="currentUser">The user performing the action.</param>
    /// <returns>The created Dojaang entity.</returns>
    Task<Dojaang> CreateDojangAsync(CreateDojaangDto dto, User currentUser);
}