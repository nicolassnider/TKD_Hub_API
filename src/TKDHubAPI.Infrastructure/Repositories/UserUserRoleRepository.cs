namespace TKDHubAPI.Infrastructure.Repositories;

public class UserUserRoleRepository : GenericRepository<UserUserRole>, IUserUserRoleRepository
{
    private readonly TkdHubDbContext _context;

    public UserUserRoleRepository(TkdHubDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserUserRole>> GetByUserIdAsync(int userId)
    {
        return await _context.UserUserRoles
            .Where(uur => uur.UserId == userId)
            .ToListAsync();
    }

    public async Task<bool> UserHasRoleAsync(int userId, int userRoleId)
    {
        return await _context.UserUserRoles
            .AnyAsync(uur => uur.UserId == userId && uur.UserRoleId == userRoleId);
    }

    public async Task AddUserUserRoleAsync(UserUserRole userUserRole)
    {
        await _context.UserUserRoles.AddAsync(userUserRole);
    }

    public async Task RemoveUserUserRoleAsync(int userId, int userRoleId)
    {
        var entity = await _context.UserUserRoles
            .FirstOrDefaultAsync(uur => uur.UserId == userId && uur.UserRoleId == userRoleId);

        if (entity != null)
        {
            _context.UserUserRoles.Remove(entity);
        }
    }
}
