using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;


namespace TKDHubAPI.Infrastructure.Repositories;
public class UnitOfWork : IUnitOfWork, IAsyncDisposable
{
    private readonly TkdHubDbContext _context;
    private IDbContextTransaction? _transaction;


    public IUserRepository Users { get; }
    public IRankRepository Ranks { get; }
    public IUserRoleRepository UserRoles { get; }


    public IBlogPostRepository BlogPosts { get; }


    public IStudentClassAttendanceRepository StudentClassAttendances { get; }


    public IStudentClassRepository StudentClasses { get; }


    public IUserUserRoleRepository UserUserRoles { get; }


    public UnitOfWork(
        TkdHubDbContext context,
        IUserRepository userRepository,
        IRankRepository ranks,
        IUserRoleRepository userRoleRepository,
        IBlogPostRepository blogPostRepository,
        IStudentClassAttendanceRepository studentClassAttendanceRepository,
        IStudentClassRepository studentClassRepository,
        IUserUserRoleRepository userUserRoleRepository)
    {
        _context = context;
        Users = userRepository;
        Ranks = ranks;
        UserRoles = userRoleRepository;
        BlogPosts = blogPostRepository;
        StudentClassAttendances = studentClassAttendanceRepository;
        StudentClasses = studentClassRepository;
        UserUserRoles = userUserRoleRepository;
    }


    public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();


    public async Task BeginTransactionAsync()
    {
        if (_transaction is not null)
            return;


        _transaction = await _context.Database.BeginTransactionAsync();
    }


    public async Task CommitAsync()
    {
        if (_transaction is null)
            throw new InvalidOperationException("No active transaction to commit.");


        await _context.SaveChangesAsync();
        await _transaction.CommitAsync();
        await _transaction.DisposeAsync();
        _transaction = null;
    }


    public async Task RollbackAsync()
    {
        if (_transaction is null)
            return;


        await _transaction.RollbackAsync();
        await _transaction.DisposeAsync();
        _transaction = null;
    }


    public async ValueTask DisposeAsync()
    {
        if (_transaction is not null)
        {
            await _transaction.DisposeAsync();
            _transaction = null;
        }


        await _context.DisposeAsync();
    }
}
