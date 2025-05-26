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
        return await _context.Users.FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber);
    }

    public async Task<IEnumerable<User>> GetUsersByGenderAsync(Gender gender)
    {
        return await _context.Users.Where(u => u.Gender == gender).ToListAsync();
    }

    public async Task<IEnumerable<User>> GetUsersByRoleAsync(string roleName)
    {
        return await _context.Users
            .Where(u => u.UserUserRoles.Any(uur => uur.UserRole.Name == roleName))
            .ToListAsync();
    }
}
