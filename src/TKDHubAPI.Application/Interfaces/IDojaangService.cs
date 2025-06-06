using TKDHubAPI.Application.DTOs.Dojaang;

namespace TKDHubAPI.Application.Interfaces;

/// <summary>
/// Defines CRUD operations and domain-specific actions for Dojaang entities, including creation, coach assignment, and updates.
/// </summary>
public interface IDojaangService : ICrudService<DojaangDto>
{
    /// <summary>
    /// Creates a new dojaang. Only admins are allowed to perform this action.
    /// </summary>
    /// <param name="dto">The dojaang creation DTO.</param>
    /// <param name="currentUser">The user performing the action.</param>
    /// <returns>A task that represents the asynchronous operation, containing the created Dojaang DTO.</returns>
    Task<DojaangDto> CreateDojaangAsync(CreateDojaangDto dto, User currentUser);

    /// <summary>
    /// Assigns a coach to a dojaang.
    /// </summary>
    /// <param name="dto">The update DTO containing the dojaang and coach information.</param>
    /// <returns>A task that represents the asynchronous operation, containing the updated Dojaang DTO.</returns>
    Task<DojaangDto> AssignCoachToDojaangAsync(UpdateDojaangDto dto);

    /// <summary>
    /// Adds a new dojaang asynchronously.
    /// </summary>
    /// <param name="dto">The dojaang creation DTO.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task AddAsync(CreateDojaangDto dto);

    /// <summary>
    /// Updates an existing dojaang asynchronously.
    /// </summary>
    /// <param name="dto">The update DTO containing the dojaang information.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task UpdateAsync(UpdateDojaangDto dto);
}

