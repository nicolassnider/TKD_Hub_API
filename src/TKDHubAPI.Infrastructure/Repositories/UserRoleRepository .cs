namespace TKDHubAPI.Infrastructure.Repositories;
/// <summary>
/// Repository implementation for UserRole entity.
/// </summary>
public class UserRoleRepository : GenericRepository<UserRole>, IUserRoleRepository
{
    private readonly TkdHubDbContext _context;

    public UserRoleRepository(TkdHubDbContext context) : base(context)
    {
        _context = context;
    }

    /// <summary>
    /// Gets a list of UserRole entities by their IDs.
    /// </summary>
    public async Task<List<UserRole>> GetRolesByIdsAsync(IEnumerable<int> roleIds)
    {
        return await _context.UserRoles
            .Where(r => roleIds.Contains(r.Id))
            .ToListAsync();
    }
}
