using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.Application.Services;
internal class TournamentService : ITournamentService
{
    public Task AddAsync(Tournament tournament)
    {
        throw new NotImplementedException();
    }

    public Task DeleteAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Tournament>> GetAllAsync()
    {
        throw new NotImplementedException();
    }

    public Task<Tournament?> GetByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task UpdateAsync(Tournament tournament)
    {
        throw new NotImplementedException();
    }
}
