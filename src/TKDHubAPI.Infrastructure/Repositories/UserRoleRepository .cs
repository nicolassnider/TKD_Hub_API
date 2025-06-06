namespace TKDHubAPI.Infrastructure.Repositories;

public class UserRoleRepository : GenericRepository<UserRole>, IUserRoleRepository
{
    private readonly TkdHubDbContext _context;

    public UserRoleRepository(TkdHubDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<List<UserRole>> GetRolesByIdsAsync(IEnumerable<int> roleIds)
    {
        return await _context.UserRoles
            .Where(r => roleIds.Contains(r.Id))
            .ToListAsync();
    }
}
