using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.Domain.Repositories;
public interface IRankRepository : IGenericRepository<Rank>
{
    Task<IEnumerable<Rank>> GetRanksWithUsersAsync();
}
