namespace TKDHubAPI.Infrastructure.Repositories;
public class PromotionRepository : GenericRepository<Promotion>, IPromotionRepository
{
    private readonly TkdHubDbContext _context;

    public PromotionRepository(TkdHubDbContext context) : base(context)
    {
        _context = context;
    }

    // Add promotion-specific methods here if needed
}
