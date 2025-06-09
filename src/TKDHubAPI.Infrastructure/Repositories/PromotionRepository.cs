namespace TKDHubAPI.Infrastructure.Repositories;
public class PromotionRepository : GenericRepository<Promotion>, IPromotionRepository
{
    private readonly TkdHubDbContext _context;

    public PromotionRepository(TkdHubDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Promotion>> GetAllAsync()
    {
        return await _context.Promotions
            .Include(p => p.Student)
            .Include(p => p.Rank)
            .ToListAsync();
    }

    public async Task<Promotion?> GetByIdAsync(int id)
    {
        return await _context.Promotions
            .Include(p => p.Student)
            .Include(p => p.Rank)
            .Include(p => p.Dojaang)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    // TODO: Add promotion-specific methods here if needed
}
