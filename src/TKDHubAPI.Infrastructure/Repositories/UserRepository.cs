using TKDHubAPI.Domain.Entities;
using TKDHubAPI.Domain.Repositories;
using TKDHubAPI.Infrastructure.Data;

namespace TKDHubAPI.Infrastructure.Repositories;
public class UserRepository : IUserRepository
{
    private readonly TkdHubDbContext _context;
    public UserRepository(TkdHubDbContext context) => _context = context;

    public async Task<User?> GetByIdAsync(int id) => await _context.Users.FindAsync(id);

    public async Task<IEnumerable<User>> GetAllAsync() => await _context.Users.ToListAsync();

    public async Task AddAsync(User user) => await _context.Users.AddAsync(user);

    public void Update(User user) => _context.Users.Update(user);

    public void Remove(User user) => _context.Users.Remove(user);
}
