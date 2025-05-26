namespace TKDHubAPI.Domain.Repositories;
public interface ITulRepository : IGenericRepository<Tul>
{
    Task<IEnumerable<Tul>> GetTulsWithTechniquesAsync();
    Task<Tul> GetTulWithDetailsAsync(int id);
}
