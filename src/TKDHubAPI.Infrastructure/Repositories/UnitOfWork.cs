namespace TKDHubAPI.Infrastructure.Repositories;
public class UnitOfWork : IUnitOfWork
{
    private readonly TkdHubDbContext _context;
    public IUserRepository Users { get; }
    public IRankRepository Ranks { get; }
    public IUserRoleRepository UserRoles { get; } // Added

    public UnitOfWork(
        TkdHubDbContext context,
        IUserRepository userRepository,
        IRankRepository ranks,
        IUserRoleRepository userRoleRepository // Added
    )
    {
        _context = context;
        Users = userRepository;
        Ranks = ranks;
        UserRoles = userRoleRepository; // Added
    }

    public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();
}
