namespace TKDHubAPI.Infrastructure.Repositories;
public class DojaangRepository : GenericRepository<Dojaang>, IDojaangRepository
{
    private readonly TkdHubDbContext _context;

    public DojaangRepository(TkdHubDbContext context) : base(context)
    {
        _context = context;
    }

    public override async Task<Dojaang?> GetByIdAsync(int id)
    {
        return await _context.Dojaangs
            .Include(d => d.Coach)
            .FirstOrDefaultAsync(d => d.Id == id);
    }

    public override async Task<IEnumerable<Dojaang>> GetAllAsync()
    {
        return await _context.Dojaangs
            .Include(d => d.Coach)
            .ToListAsync();
    }

    public async Task<IEnumerable<Dojaang>> GetDojaangsByCoachIdAsync(int coachId)
    {
        return await _context.Dojaangs
            .Where(d => d.UserDojaangs.Any(ud => ud.UserId == coachId))
            .ToListAsync();
    }

}
