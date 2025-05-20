using Microsoft.EntityFrameworkCore;
using TKDHubAPI.Domain.Entities;
using TKDHubAPI.Domain.Repositories;
using TKDHubAPI.Infrastructure.Data;

namespace TKDHubAPI.Infrastructure.Repositories;
public class UserRepository : GenericRepository<User>, IUserRepository
{
    private readonly TkdHubDbContext _context;

    public UserRepository(TkdHubDbContext context) : base(context)
    {
        _context = context;
    }

    //  Example User-specific methods
    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetUserByPhoneNumberAsync(string phoneNumber)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber);
    }

    public async Task<IEnumerable<User>> GetUsersByGenderAsync(Gender gender)
    {
        return await _context.Users.Where(u => u.Gender == gender).ToListAsync();
    }

    public async Task<IEnumerable<User>> GetUsersByRoleAsync(UserRole role)
    {
        return await _context.Users.Where(u => u.Role == role).ToListAsync();
    }
}