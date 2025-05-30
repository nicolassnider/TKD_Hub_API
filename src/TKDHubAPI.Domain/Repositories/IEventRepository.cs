namespace TKDHubAPI.Domain.Repositories;
public interface IEventRepository : IGenericRepository<Event>
{
    Task<IEnumerable<Event>> GetEventsWithAttendanceAsync();
    Task<IEnumerable<Event>> GetEventsByDateRangeAsync(DateTime startDate, DateTime endDate);
}
