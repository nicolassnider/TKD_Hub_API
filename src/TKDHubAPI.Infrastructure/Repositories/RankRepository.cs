namespace TKDHubAPI.Infrastructure.Repositories;
public class RankRepository : GenericRepository<Rank>, IRankRepository
{
    private readonly TkdHubDbContext _context;

    public RankRepository(TkdHubDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Rank>> GetRanksWithUsersAsync()
    {
        return await _context.Ranks.Include(r => r.Users).ToListAsync();
    }


}
