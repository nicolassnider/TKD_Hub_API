namespace TKDHubAPI.Application.Interfaces;
public interface IEventService : ICrudService<Event>
{
    Task<IEnumerable<Event>> GetEventsByDojaangIdAsync(int dojaangId);
    Task<IEnumerable<Event>> GetEventsByUserIdAsync(int userId);
    Task<IEnumerable<Event>> GetEventsByCoachIdAsync(int coachId);
    Task<IEnumerable<Event>> GetEventsByTypeAsync(EventType eventType);
    Task<IEnumerable<Event>> GetEventsByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<IEnumerable<Event>> GetEventsByLocationAsync(string location);
    Task<IEnumerable<Event>> GetEventsByNameAsync(string name);
}