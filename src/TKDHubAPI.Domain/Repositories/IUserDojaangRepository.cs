namespace TKDHubAPI.Domain.Repositories;

/// <summary>
/// Defines repository operations for managing <see cref="UserDojaang"/> entities,
/// which represent the relationship between users and dojaangs (e.g., coaching or membership roles).
/// </summary>
public interface IUserDojaangRepository
{
    /// <summary>
    /// Retrieves the <see cref="UserDojaang"/> entity representing the coach relationship for a specific dojaang.
    /// </summary>
    /// <param name="dojaangId">The unique identifier of the dojaang.</param>
    /// <returns>
    /// The <see cref="UserDojaang"/> entity for the coach of the specified dojaang,
    /// or <c>null</c> if no coach relationship exists.
    /// </returns>
    Task<UserDojaang?> GetCoachRelationForDojaangAsync(int dojaangId);

    /// <summary>
    /// Retrieves all <see cref="UserDojaang"/> entities.
    /// </summary>
    /// <returns>A collection of all user-dojaang relationships.</returns>
    Task<IEnumerable<UserDojaang>> GetAllAsync();

    /// <summary>
    /// Adds a new <see cref="UserDojaang"/> entity to the repository.
    /// </summary>
    /// <param name="entity">The user-dojaang relationship to add.</param>
    Task AddAsync(UserDojaang entity);

    // Add more methods as needed (e.g., Remove, Update, etc.)
}