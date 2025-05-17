using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.Application.Interfaces;
public interface IRankService : ICrudService<Rank>
{
    /*
     * Add any additional methods specific to Rank management here.
     * For example, methods to get ranks by color, order, etc.
     */
    Task<IEnumerable<Rank>> GetRanksByColorAsync(Rank.BeltColor color);
    Task<IEnumerable<Rank>> GetRanksByOrderAsync(int order);
    Task<IEnumerable<Rank>> GetRanksByDanLevelAsync(int danLevel);
    Task<IEnumerable<Rank>> GetRanksByStripeColorAsync(Rank.BeltColor stripeColor);
    Task<IEnumerable<Rank>> GetRanksByDescriptionAsync(string description);
    Task<IEnumerable<Rank>> GetRanksByNameAsync(string name);
    Task<IEnumerable<Rank>> GetRanksByDojangIdAsync(int dojangId);
    Task<IEnumerable<Rank>> GetRanksByUserIdAsync(int userId);
    Task<IEnumerable<Rank>> GetRanksByCoachIdAsync(int coachId);
    Task<IEnumerable<Rank>> GetRanksByTypeAsync(Rank.BeltColor rankType);
    Task<IEnumerable<Rank>> GetRanksByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<IEnumerable<Rank>> GetRanksByLocationAsync(string location);


}