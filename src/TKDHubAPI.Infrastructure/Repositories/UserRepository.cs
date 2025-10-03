namespace TKDHubAPI.Infrastructure.Repositories;


public class UserRepository : GenericRepository<User>, IUserRepository
{
    private readonly TkdHubDbContext _context;


    public UserRepository(TkdHubDbContext context) : base(context)
    {
        _context = context;
    }


    public async Task<List<User>> GetAllAsync()
    {
        return await _context.Users
            .Include(u => u.UserUserRoles)
                .ThenInclude(uur => uur.UserRole)
            .Include(u => u.UserDojaangs)
            .ToListAsync();
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


    public async Task<IEnumerable<int>> GetStudentIdsByClassIdAsync(int classId)
    {
        return await _context.StudentClasses
            .Where(sc => sc.TrainingClassId == classId)
            .Select(sc => sc.StudentId)
            .ToListAsync();
    }


    public async Task<IEnumerable<UserUserRole>> GetUserUserRolesAsync(int userId)
    {
        return await _context.UserUserRoles
            .Include(uur => uur.UserRole)
            .Where(uur => uur.UserId == userId)
            .ToListAsync();
    }


    public async Task AddUserUserRoleAsync(UserUserRole userUserRole)
    {
        await _context.UserUserRoles.AddAsync(userUserRole);
        await _context.SaveChangesAsync();
    }


    public async Task RemoveUserUserRoleAsync(int userId, int userRoleId)
    {
        var entity = await _context.UserUserRoles
            .FirstOrDefaultAsync(uur => uur.UserId == userId && uur.UserRoleId == userRoleId);
        if (entity != null)
        {
            _context.UserUserRoles.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
