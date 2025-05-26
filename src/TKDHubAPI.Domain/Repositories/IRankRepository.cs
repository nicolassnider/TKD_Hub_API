namespace TKDHubAPI.Domain.Repositories;
public interface IRankRepository : IGenericRepository<Rank>
{
    Task<IEnumerable<Rank>> GetRanksWithUsersAsync();
}
