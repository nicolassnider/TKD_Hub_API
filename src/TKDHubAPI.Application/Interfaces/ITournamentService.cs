using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.Application.Interfaces;
public interface ITournamentService
{
    Task<IEnumerable<Tournament>> GetAllAsync();
    Task<Tournament?> GetByIdAsync(int id);
    Task AddAsync(Tournament tournament);
    Task UpdateAsync(Tournament tournament);
    Task DeleteAsync(int id);
}