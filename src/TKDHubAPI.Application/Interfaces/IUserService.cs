using TKDHubAPI.Application.DTOs.User;

namespace TKDHubAPI.Application.Interfaces;
public interface IUserService : ICrudService<User>
{

    Task<UserDto> CreateUserAsync(int requestingUserId, IEnumerable<string> currentUserRoles, CreateUserDto createUserDto);
    Task<User> GetUserByEmailAsync(string email);
    Task<User> GetUserByPhoneNumberAsync(string phoneNumber);
    Task<IEnumerable<User>> GetUsersByRoleAsync(string roleName);
    Task<IEnumerable<User>> GetUsersByGenderAsync(Gender gender);

    /// <summary>
    /// Adds a new user and links the user to the specified roles.
    /// </summary>
    Task<User> AddUserWithRolesAsync(CreateUserDto createUserDto);

    /// <summary>
    /// Registers a new user with password.
    /// </summary>
    Task<User?> RegisterAsync(CreateUserDto createUserDto, string password);

    /// <summary>
    /// Authenticates a user and returns the user if successful.
    /// </summary>
    Task<User?> LoginAsync(string email, string password);

    /// <summary>
    /// Authenticates a user and returns a JWT token if successful.
    /// </summary>
    Task<string?> LoginWithTokenAsync(string email, string password);

    /// <summary>
    /// Authenticates a user and returns a JWT token and user info if successful.
    /// </summary>
    Task<(string? Token, UserDto? User)> LoginAndGetTokenAsync(LoginDto loginDto);

    /// <summary>
    /// Gets the role name for a given role ID.
    /// </summary>
    Task<string?> GetRoleNameById(int roleId);

    /// <summary>
    /// Gets the role names for a list of role IDs.
    /// </summary>
    Task<List<string>> GetRoleNamesByIdsAsync(List<int> roleIds);

    /// <summary>
    /// Checks if the current user (by id and roles) is allowed to create a user with the specified roles.
    /// Only an Admin can create an Admin or Coach.
    /// </summary>
    /// <param name="currentUserRoles">Roles of the user making the request</param>
    /// <param name="newUserRoleNames">Roles to assign to the new user</param>
    /// <returns>True if allowed, false otherwise</returns>
    bool CanAssignRoles(IEnumerable<string> currentUserRoles, IEnumerable<string> newUserRoleNames);

    /// <summary>
    /// Checks if a coach manages a specific dojaang.
    /// </summary>
    /// <param name="coachId">The coach's user ID.</param>
    /// <param name="dojaangId">The dojaang ID.</param>
    /// <returns>True if the coach manages the dojaang, false otherwise.</returns>
    Task<bool> CoachManagesDojaangAsync(int coachId, int dojaangId);

    /// <summary>
    /// Allows a coach to add another coach only for the dojaang(s) they manage.
    /// Admins can add a coach to any dojaang.
    /// </summary>
    /// <param name="requestingUserId">The user ID of the coach making the request.</param>
    /// <param name="createCoachDto">The DTO for the new coach.</param>
    /// <returns>The created coach user.</returns>
    Task<User> AddCoachToDojaangAsync(int requestingUserId, CreateUserDto createCoachDto);

    /// <summary>
    /// Gets the list of dojaang IDs managed by the given user (coach).
    /// </summary>
    /// <param name="coachId">The coach's user ID.</param>
    /// <returns>List of managed dojaang IDs.</returns>
    Task<List<int>> GetManagedDojaangIdsAsync(int coachId);

    /// <summary>
    /// Gets all students belonging to a specific dojaang.
    /// </summary>
    Task<IEnumerable<User>> GetStudentsByDojaangIdAsync(int dojaangId);

    /// <summary>
    /// Removes the association between a coach and a managed dojaang.
    /// </summary>
    /// <param name="coachId">The coach's user ID.</param>
    /// <param name="dojaangId">The dojaang ID to remove from management.</param>
    Task RemoveCoachFromDojaangAsync(int coachId, int dojaangId);

    /// <summary>
    /// Adds a managed dojaang relation for a coach if not already present.
    /// </summary>
    /// <param name="coachId">The coach's user ID.</param>
    /// <param name="dojaangId">The dojaang ID to add to management.</param>
    Task AddCoachToDojaangRelationAsync(int coachId, int dojaangId);
}
