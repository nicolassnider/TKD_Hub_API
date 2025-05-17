using TKDHubAPI.Domain.Repositories;
using TKDHubAPI.Infrastructure.Data;

namespace TKDHubAPI.Infrastructure.Repositories;
public class UnitOfWork : IUnitOfWork
{
    private readonly TkdHubDbContext _context;
    public IUserRepository Users { get; }

    public UnitOfWork(TkdHubDbContext context, IUserRepository userRepository)
    {
        _context = context;
        Users = userRepository;
    }

    public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();
}
