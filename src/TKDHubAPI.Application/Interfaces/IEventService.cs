/// <summary>
/// Service interface for managing events, including creation, retrieval, and filtering by various criteria.
/// </summary>
public interface IEventService : ICrudService<Event>
{
    /// <summary>
    /// Adds a new event to the system. Only admins are allowed to perform this action.
    /// </summary>
    /// <param name="ev">The event entity to add.</param>
    /// <param name="user">The user performing the action (should be an admin).</param>
    Task AddAsync(Event ev, User user);

    /// <summary>
    /// Retrieves all events associated with a specific dojaang.
    /// </summary>
    /// <param name="dojaangId">The unique identifier of the dojaang.</param>
    /// <returns>A collection of events for the specified dojaang.</returns>
    Task<IEnumerable<Event>> GetEventsByDojaangIdAsync(int dojaangId);

    /// <summary>
    /// Retrieves all events associated with a specific user.
    /// </summary>
    /// <param name="userId">The unique identifier of the user.</param>
    /// <returns>A collection of events for the specified user.</returns>
    Task<IEnumerable<Event>> GetEventsByUserIdAsync(int userId);

    /// <summary>
    /// Retrieves all events associated with a specific coach.
    /// </summary>
    /// <param name="coachId">The unique identifier of the coach.</param>
    /// <returns>A collection of events for the specified coach.</returns>
    Task<IEnumerable<Event>> GetEventsByCoachIdAsync(int coachId);

    /// <summary>
    /// Retrieves all events of a specific type.
    /// </summary>
    /// <param name="eventType">The type of event to filter by.</param>
    /// <returns>A collection of events matching the specified type.</returns>
    Task<IEnumerable<Event>> GetEventsByTypeAsync(EventType eventType);

    /// <summary>
    /// Retrieves all events occurring within a specified date range.
    /// </summary>
    /// <param name="startDate">The start date of the range (inclusive).</param>
    /// <param name="endDate">The end date of the range (inclusive).</param>
    /// <returns>A collection of events within the specified date range.</returns>
    Task<IEnumerable<Event>> GetEventsByDateRangeAsync(DateTime startDate, DateTime endDate);

    /// <summary>
    /// Retrieves all events occurring at a specific location.
    /// </summary>
    /// <param name="location">The location to filter events by.</param>
    /// <returns>A collection of events at the specified location.</returns>
    Task<IEnumerable<Event>> GetEventsByLocationAsync(string location);

    /// <summary>
    /// Retrieves all events with a specific name.
    /// </summary>
    /// <param name="name">The name of the event to filter by.</param>
    /// <returns>A collection of events matching the specified name.</returns>
    Task<IEnumerable<Event>> GetEventsByNameAsync(string name);
}
