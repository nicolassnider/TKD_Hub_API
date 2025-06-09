namespace TKDHubAPI.Domain.Repositories;
/// <summary>
/// Coordinates the work of multiple repositories by providing access to them and managing transactional operations through a single SaveChangesAsync method.
/// </summary>
public interface IUnitOfWork
{
    IUserRepository Users { get; }
    IRankRepository Ranks { get; }
    IUserRoleRepository UserRoles { get; }
    // Add other repositories as needed, e.g. IRankRepository Ranks { get; }
    Task<int> SaveChangesAsync();
}
