using TKDHubAPI.Application.DTOs.Dojaang;

namespace TKDHubAPI.Application.Interfaces;
public interface IDojaangService : ICrudService<DojaangDto>
{
    /// <summary>
    /// Creates a new dojaang. Only admins are allowed to perform this action.
    /// </summary>
    /// <param name="dto">The dojaang creation DTO.</param>
    /// <param name="currentUser">The user performing the action.</param>
    /// <returns>The created Dojaang DTO.</returns>
    Task<DojaangDto> CreateDojaangAsync(CreateDojaangDto dto, User currentUser);


    /// <summary>
    /// Assign a Coach to a Dojaang
    /// </summary>
    Task<DojaangDto> AssignCoachToDojaangAsync(UpdateDojaangDto dto);


    Task AddAsync(CreateDojaangDto dto);
    Task UpdateAsync(UpdateDojaangDto dto);
}

