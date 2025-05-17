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

    public Task<IEnumerable<Tournament>> GetTournamentsByCoachIdAsync(int coachId)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Tournament>> GetTournamentsByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Tournament>> GetTournamentsByDojangIdAsync(int dojangId)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Tournament>> GetTournamentsByLocationAsync(string location)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Tournament>> GetTournamentsByNameAsync(string name)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Tournament>> GetTournamentsByUserIdAsync(int userId)
    {
        throw new NotImplementedException();
    }

    public Task UpdateAsync(Tournament tournament)
    {
        throw new NotImplementedException();
    }
}
