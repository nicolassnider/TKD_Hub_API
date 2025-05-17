using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.Application.Services;
public class RankService : IRankService
{
    public Task AddAsync(Rank rank)
    {
        throw new NotImplementedException();
    }

    public Task DeleteAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Rank>> GetAllAsync()
    {
        throw new NotImplementedException();
    }

    public Task<Rank?> GetByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task UpdateAsync(Rank rank)
    {
        throw new NotImplementedException();
    }
}
