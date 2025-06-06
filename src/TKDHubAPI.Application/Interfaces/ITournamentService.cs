namespace TKDHubAPI.Application.Interfaces;

/// <summary>
/// Defines a contract for managing tournaments asynchronously, including operations to retrieve tournaments by dojaang, user, coach, date range, location, and name.
/// </summary>
public interface ITournamentService : ICrudService<Tournament>
{
    /// <summary>
    /// Retrieves a list of tournaments associated with a specific dojaang asynchronously.
    /// </summary>
    /// <param name="dojaangId">The identifier of the dojaang whose tournaments are to be retrieved.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of Tournaments associated with the specified dojaang.</returns>
    Task<IEnumerable<Tournament>> GetTournamentsByDojaangIdAsync(int dojaangId);

    /// <summary>
    /// Retrieves a list of tournaments associated with a specific user asynchronously.
    /// </summary>
    /// <param name="userId">The identifier of the user whose tournaments are to be retrieved.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of Tournaments associated with the specified user.</returns>
    Task<IEnumerable<Tournament>> GetTournamentsByUserIdAsync(int userId);

    /// <summary>
    /// Retrieves a list of tournaments associated with a specific coach asynchronously.
    /// </summary>
    /// <param name="coachId">The identifier of the coach whose tournaments are to be retrieved.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of Tournaments associated with the specified coach.</returns>
    Task<IEnumerable<Tournament>> GetTournamentsByCoachIdAsync(int coachId);

    /// <summary>
    /// Retrieves a list of tournaments that fall within a specific date range asynchronously.
    /// </summary>
    /// <param name="startDate">The start date of the range.</param>
    /// <param name="endDate">The end date of the range.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of Tournaments that fall within the specified date range.</returns>
    Task<IEnumerable<Tournament>> GetTournamentsByDateRangeAsync(DateTime startDate, DateTime endDate);

    /// <summary>
    /// Retrieves a list of tournaments associated with a specific location asynchronously.
    /// </summary>
    /// <param name="location">The location to filter tournaments.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of Tournaments associated with the specified location.</returns>
    Task<IEnumerable<Tournament>> GetTournamentsByLocationAsync(string location);

    /// <summary>
    /// Retrieves a list of tournaments that match a specific name asynchronously.
    /// </summary>
    /// <param name="name">The name to filter tournaments.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of Tournaments that match the specified name.</returns>
    Task<IEnumerable<Tournament>> GetTournamentsByNameAsync(string name);
}

