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

    public Task<IEnumerable<Rank>> GetRanksByCoachIdAsync(int coachId)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Rank>> GetRanksByColorAsync(Rank.BeltColor color)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Rank>> GetRanksByDanLevelAsync(int danLevel)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Rank>> GetRanksByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Rank>> GetRanksByDescriptionAsync(string description)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Rank>> GetRanksByDojangIdAsync(int dojangId)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Rank>> GetRanksByLocationAsync(string location)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Rank>> GetRanksByNameAsync(string name)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Rank>> GetRanksByOrderAsync(int order)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Rank>> GetRanksByStripeColorAsync(Rank.BeltColor stripeColor)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Rank>> GetRanksByTypeAsync(Rank.BeltColor rankType)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Rank>> GetRanksByUserIdAsync(int userId)
    {
        throw new NotImplementedException();
    }

    public Task UpdateAsync(Rank rank)
    {
        throw new NotImplementedException();
    }
}
