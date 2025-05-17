using TKDHubAPI.Domain.Entities;
using TKDHubAPI.Domain.Repositories;
using TKDHubAPI.Infrastructure.Data;

namespace TKDHubAPI.Infrastructure.Repositories;
public class DojangRepository : GenericRepository<Dojang>, IDojangRepository
{
    public DojangRepository(TkdHubDbContext context) : base(context) { }
    // Implement Dojang-specific methods here if needed
}