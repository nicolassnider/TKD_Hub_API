namespace TKDHubAPI.Domain.Repositories;

/// <summary>
/// Coordinates the work of multiple repositories by providing access to them and managing transactional operations.
/// Use <see cref="SaveChangesAsync"/> to persist all changes as a single unit of work.
/// </summary>
public interface IUnitOfWork
{
    /// <summary>
    /// Gets the repository for user entities.
    /// </summary>
    IUserRepository Users { get; }

    /// <summary>
    /// Gets the repository for rank entities.
    /// </summary>
    IRankRepository Ranks { get; }

    /// <summary>
    /// Gets the repository for user role entities.
    /// </summary>
    IUserRoleRepository UserRoles { get; }

    /// <summary>
    /// Gets the repository for student class attendance entities.
    /// </summary>
    IStudentClassAttendanceRepository StudentClassAttendances { get; }

    /// <summary>
    /// Gets the repository for student class entities.
    /// </summary>
    IStudentClassRepository StudentClasses { get; }

    /// <summary>
    /// Gets the repository for user-user role entities.
    /// </summary>
    IUserUserRoleRepository UserUserRoles { get; }

    // Add other repositories as needed, e.g. IRankRepository Ranks { get; }

    /// <summary>
    /// Persists all changes made through the repositories to the underlying data store as a single transaction.
    /// </summary>
    /// <returns>The number of state entries written to the database.</returns>
    Task<int> SaveChangesAsync();


}
