namespace TKDHubAPI.Infrastructure.Repositories;
public class UserDojaangRepository : IUserDojaangRepository
{
    private readonly TkdHubDbContext _context;

    public UserDojaangRepository(TkdHubDbContext context)
    {
        _context = context;
    }

    public async Task<UserDojaang?> GetCoachRelationForDojaangAsync(int dojaangId)
    {
        return await _context.UserDojaangs
            .Include(ud => ud.User)
            .FirstOrDefaultAsync(ud => ud.DojaangId == dojaangId && ud.Role == "Coach");
    }

    public async Task<IEnumerable<UserDojaang>> GetAllAsync()
    {
        return await _context.UserDojaangs
            .Include(ud => ud.User)
            .ToListAsync();
    }

    public async Task AddAsync(UserDojaang entity)
    {
        await _context.UserDojaangs.AddAsync(entity);
        await _context.SaveChangesAsync();
    }
}
