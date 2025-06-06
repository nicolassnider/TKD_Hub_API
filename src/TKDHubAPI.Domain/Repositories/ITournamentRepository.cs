namespace TKDHubAPI.Domain.Repositories;
/// <summary>
/// Provides repository operations for Tournament entities, including retrieval of upcoming tournaments and tournaments with detailed information.
/// </summary>
public interface ITournamentRepository : IGenericRepository<Tournament>
{
    /// <summary>
    /// Retrieves a collection of upcoming tournaments asynchronously.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation, containing a collection of upcoming tournaments.</returns>
    Task<IEnumerable<Tournament>> GetUpcomingTournamentsAsync();

    /// <summary>
    /// Retrieves a collection of tournaments along with their details asynchronously.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation, containing a collection of tournaments with their details.</returns>
    Task<IEnumerable<Tournament>> GetTournamentsWithDetailsAsync();
}
