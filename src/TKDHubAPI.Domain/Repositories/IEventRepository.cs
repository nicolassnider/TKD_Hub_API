namespace TKDHubAPI.Domain.Repositories;

/// <summary>
/// Provides repository operations for Event entities, including retrieval with attendance information and filtering by date range.
/// </summary>
public interface IEventRepository : IGenericRepository<Event>
{
    /// <summary>
    /// Retrieves a collection of events along with their attendance information asynchronously.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation, containing a collection of events with attendance.</returns>
    Task<IEnumerable<Event>> GetEventsWithAttendanceAsync();

    /// <summary>
    /// Retrieves a collection of events that fall within a specific date range asynchronously.
    /// </summary>
    /// <param name="startDate">The start date of the range.</param>
    /// <param name="endDate">The end date of the range.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of events within the specified date range.</returns>
    Task<IEnumerable<Event>> GetEventsByDateRangeAsync(DateTime startDate, DateTime endDate);
}

