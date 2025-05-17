using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.Application.Interfaces;
public interface IRankService
{
    Task<IEnumerable<Rank>> GetAllAsync();
    Task<Rank?> GetByIdAsync(int id);
    Task AddAsync(Rank rank);
    Task UpdateAsync(Rank rank);
    Task DeleteAsync(int id);
}