using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.Application.Services;
public class EventService : IEventService
{
    public Task AddAsync(Event ev)
    {
        throw new NotImplementedException();
    }

    public Task DeleteAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Event>> GetAllAsync()
    {
        throw new NotImplementedException();
    }

    public Task<Event?> GetByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Event>> GetEventsByCoachIdAsync(int coachId)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Event>> GetEventsByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Event>> GetEventsByDojaangIdAsync(int dojaangId)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Event>> GetEventsByLocationAsync(string location)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Event>> GetEventsByNameAsync(string name)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Event>> GetEventsByTypeAsync(Event.EventType eventType)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Event>> GetEventsByUserIdAsync(int userId)
    {
        throw new NotImplementedException();
    }

    public Task UpdateAsync(Event ev)
    {
        throw new NotImplementedException();
    }
}
