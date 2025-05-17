using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.Application.Interfaces;
public interface IEventService
{
    Task<IEnumerable<Event>> GetAllAsync();
    Task<Event?> GetByIdAsync(int id);
    Task AddAsync(Event ev);
    Task UpdateAsync(Event ev);
    Task DeleteAsync(int id);
}
