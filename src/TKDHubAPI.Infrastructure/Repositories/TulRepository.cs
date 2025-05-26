namespace TKDHubAPI.Infrastructure.Repositories;
public class TulRepository : GenericRepository<Tul>, ITulRepository
{
    private readonly TkdHubDbContext _context;

    public TulRepository(TkdHubDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Tul>> GetTulsWithTechniquesAsync()
    {
        return await _context.Tuls
            .Include(t => t.TulTechniques)
            .ToListAsync();
    }

    public async Task<Tul> GetTulWithDetailsAsync(int id)
    {
        return await _context.Tuls
            .Include(t => t.TulTechniques)
            .FirstOrDefaultAsync(t => t.Id == id);
    }
}
