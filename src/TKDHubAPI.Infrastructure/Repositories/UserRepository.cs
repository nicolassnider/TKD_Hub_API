namespace TKDHubAPI.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for User entity.
/// </summary>
public class UserRepository : GenericRepository<User>, IUserRepository
{
    private readonly TkdHubDbContext _context;

    public UserRepository(TkdHubDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users
            .Include(u => u.UserDojaangs)
                .ThenInclude(ud => ud.Dojaang)
            .Include(u => u.UserUserRoles)
                .ThenInclude(uur => uur.UserRole)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _context.Users
            .Include(u => u.UserDojaangs)
                .ThenInclude(ud => ud.Dojaang)
            .Include(u => u.UserUserRoles)
                .ThenInclude(uur => uur.UserRole)
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetUserByPhoneNumberAsync(string phoneNumber)
    {
        return await _context.Users
            .Include(u => u.UserDojaangs)
                .ThenInclude(ud => ud.Dojaang)
            .Include(u => u.UserUserRoles)
                .ThenInclude(uur => uur.UserRole)
            .FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber);
    }

    public async Task<IEnumerable<User>> GetUsersByGenderAsync(Gender gender)
    {
        return await _context.Users
            .Include(u => u.UserDojaangs)
                .ThenInclude(ud => ud.Dojaang)
            .Include(u => u.UserUserRoles)
                .ThenInclude(uur => uur.UserRole)
            .Where(u => u.Gender == gender)
            .ToListAsync();
    }

    public async Task<IEnumerable<User>> GetUsersByRoleAsync(string roleName)
    {
        return await _context.Users
            .Include(u => u.UserDojaangs)
                .ThenInclude(ud => ud.Dojaang)
            .Include(u => u.UserUserRoles)
                .ThenInclude(uur => uur.UserRole)
            .Where(u => u.UserUserRoles.Any(uur => uur.UserRole.Name == roleName))
            .ToListAsync();
    }

    public async Task<IEnumerable<User>> GetStudentsByDojaangIdAsync(int dojaangId)
    {
        var normalizedDojaangId = NormalizeDojaangId(dojaangId);
        if (normalizedDojaangId == null)
        {
            // Return empty if dojaangId is 0 or null, as there is no such dojaang
            return new List<User>();
        }

        return await _context.Users
            .Include(u => u.UserDojaangs)
                .ThenInclude(ud => ud.Dojaang)
            .Include(u => u.UserUserRoles)
                .ThenInclude(uur => uur.UserRole)
            .Where(u =>
                u.DojaangId == normalizedDojaangId &&
                u.UserUserRoles.Any(uur => uur.UserRole.Name == "Student"))
            .ToListAsync();
    }

    // Add this helper method to the class:
    private int? NormalizeDojaangId(int? dojaangId)
    {
        return (dojaangId == null || dojaangId == 0) ? null : dojaangId;
    }
}
