using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.Application.Interfaces;
public interface ITulService
{
    Task<IEnumerable<Tul>> GetAllAsync();
    Task<Tul?> GetByIdAsync(int id);
    Task AddAsync(Tul tul);
    Task UpdateAsync(Tul tul);
    Task DeleteAsync(int id);
}
