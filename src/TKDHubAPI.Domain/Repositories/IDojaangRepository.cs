namespace TKDHubAPI.Domain.Repositories;
/// <summary>
/// Provides repository operations for Dojaang entities, inheriting generic CRUD functionality.
/// </summary>
public interface IDojaangRepository : IGenericRepository<Dojaang>
{
    /// <summary>
    /// Retrieves all <see cref="Dojaang"/> entities where the specified user is assigned as a coach.
    /// </summary>
    /// <param name="coachId">The unique identifier of the coach.</param>
    /// <returns>An enumerable collection of <see cref="Dojaang"/> entities coached by the specified user.</returns>
    Task<IEnumerable<Dojaang>> GetDojaangsByCoachIdAsync(int coachId);
}

