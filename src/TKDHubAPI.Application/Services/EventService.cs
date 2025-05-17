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

    public Task UpdateAsync(Event ev)
    {
        throw new NotImplementedException();
    }
}
