namespace TKDHubAPI.Infrastructure.Repositories;
public class UnitOfWork : IUnitOfWork
{
    private readonly TkdHubDbContext _context;
    public IUserRepository Users { get; }
    public IRankRepository Ranks { get; }
    public IUserRoleRepository UserRoles { get; } // Added

    public IBlogPostRepository BlogPosts { get; } // Added for BlogPostRepository  

    public UnitOfWork(
        TkdHubDbContext context,
        IUserRepository userRepository,
        IRankRepository ranks,
        IUserRoleRepository userRoleRepository, // Added
        IBlogPostRepository blogPostRepository // Added for BlogPostRepository
    )
    {
        _context = context;
        Users = userRepository;
        Ranks = ranks;
        UserRoles = userRoleRepository; // Added
        BlogPosts = blogPostRepository;
    }

    public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();
}
