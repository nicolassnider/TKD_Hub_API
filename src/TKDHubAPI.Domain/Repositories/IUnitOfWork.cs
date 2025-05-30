namespace TKDHubAPI.Domain.Repositories;
public interface IUnitOfWork
{
    IUserRepository Users { get; }
    IRankRepository Ranks { get; }
    // Add other repositories as needed, e.g. IRankRepository Ranks { get; }
    Task<int> SaveChangesAsync();
}
