using TKDHubAPI.Domain.Entities;
using TKDHubAPI.Domain.Repositories;
using TKDHubAPI.Infrastructure.Data;

namespace TKDHubAPI.Infrastructure.Repositories;
public class DojaangRepository : GenericRepository<Dojaang>, IDojaangRepository
{
    private readonly TkdHubDbContext _context;

    public DojaangRepository(TkdHubDbContext context) : base(context)
    {
        _context = context;
    }

}