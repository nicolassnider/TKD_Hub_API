namespace TKDHubAPI.Application.Interfaces;
public interface IRankService : ICrudService<Rank>
{
    /*
     * Add any additional methods specific to Rank management here.
     * For example, methods to get ranks by color, order, etc.
     */
    Task<IEnumerable<Rank>> GetRanksByColorAsync(BeltColor color);
    Task<IEnumerable<Rank>> GetRanksByOrderAsync(int order);
    Task<IEnumerable<Rank>> GetRanksByDanLevelAsync(int danLevel);
    Task<IEnumerable<Rank>> GetRanksByStripeColorAsync(BeltColor stripeColor);
    Task<IEnumerable<Rank>> GetRanksByDescriptionAsync(string description);
    Task<IEnumerable<Rank>> GetRanksByNameAsync(string name);
    Task<IEnumerable<Rank>> GetRanksByDojaangIdAsync(int dojaangId);
    Task<IEnumerable<Rank>> GetRanksByUserIdAsync(int userId);
    Task<IEnumerable<Rank>> GetRanksByCoachIdAsync(int coachId);
    Task<IEnumerable<Rank>> GetRanksByTypeAsync(BeltColor rankType);
    Task<IEnumerable<Rank>> GetRanksByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<IEnumerable<Rank>> GetRanksByLocationAsync(string location);


}