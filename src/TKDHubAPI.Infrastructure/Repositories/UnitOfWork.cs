namespace TKDHubAPI.Infrastructure.Repositories;
public class UnitOfWork : IUnitOfWork
{
    private readonly TkdHubDbContext _context;
    public IUserRepository Users { get; }
    public IRankRepository Ranks { get; }

    public UnitOfWork(TkdHubDbContext context, IUserRepository userRepository, IRankRepository ranks)
    {
        _context = context;
        Users = userRepository;
        Ranks = ranks;
    }

    public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();
}
