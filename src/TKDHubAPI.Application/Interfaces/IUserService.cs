namespace TKDHubAPI.Application.Interfaces;

/// <summary>
/// Interface for user-related operations, including user creation, retrieval, and management.
/// </summary>
public interface IUserService : ICrudService<User>
{
    /// <summary>
    /// Creates a new user and links the user to the specified roles.
    /// </summary>
    /// <param name="requestingUserId">The ID of the user making the request.</param>
    /// <param name="currentUserRoles">The roles of the current user.</param>
    /// <param name="createUserDto">The DTO containing the information required to create a new user.</param>
    /// <returns>A task that represents the asynchronous operation, containing the created UserDto.</returns>
    Task<UserDto> CreateUserAsync(int requestingUserId, IEnumerable<string> currentUserRoles, CreateUserDto createUserDto);

    /// <summary>
    /// Retrieves a user by their email asynchronously.
    /// </summary>
    /// <param name="email">The email of the user to retrieve.</param>
    /// <returns>A task that represents the asynchronous operation, containing the User if found.</returns>
    Task<User> GetUserByEmailAsync(string email);

    /// <summary>
    /// Retrieves a user by their phone number asynchronously.
    /// </summary>
    /// <param name="phoneNumber">The phone number of the user to retrieve.</param>
    /// <returns>A task that represents the asynchronous operation, containing the User if found.</returns>
    Task<User> GetUserByPhoneNumberAsync(string phoneNumber);

    /// <summary>
    /// Retrieves a list of users associated with a specific role asynchronously.
    /// </summary>
    /// <param name="roleName">The name of the role to filter users.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of Users associated with the specified role.</returns>
    Task<IEnumerable<User>> GetUsersByRoleAsync(string roleName);

    /// <summary>
    /// Retrieves a list of users by their gender asynchronously.
    /// </summary>
    /// <param name="gender">The gender to filter users.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of Users associated with the specified gender.</returns>
    Task<IEnumerable<User>> GetUsersByGenderAsync(Gender gender);

    /// <summary>
    /// Adds a new user and links the user to the specified roles.
    /// </summary>
    /// <param name="createUserDto">The DTO containing the information required to create a new user.</param>
    /// <returns>A task that represents the asynchronous operation, containing the created User.</returns>
    Task<User> AddUserWithRolesAsync(CreateUserDto createUserDto);

    /// <summary>
    /// Registers a new user with a password.
    /// </summary>
    /// <param name="createUserDto">The DTO containing the information required to create a new user.</param>
    /// <param name="password">The password for the new user.</param>
    /// <returns>A task that represents the asynchronous operation, containing the registered User if successful; otherwise, null.</returns>
    Task<User?> RegisterAsync(CreateUserDto createUserDto, string password);

    /// <summary>
    /// Authenticates a user and returns the user if successful.
    /// </summary>
    /// <param name="email">The email of the user to authenticate.</param>
    /// <param name="password">The password of the user to authenticate.</param>
    /// <returns>A task that represents the asynchronous operation, containing the authenticated User if successful; otherwise, null.</returns>
    Task<User?> LoginAsync(string email, string password);

    /// <summary>
    /// Authenticates a user and returns a JWT token if successful.
    /// </summary>
    /// <param name="email">The email of the user to authenticate.</param>
    /// <param name="password">The password of the user to authenticate.</param>
    /// <returns>A task that represents the asynchronous operation, containing the JWT token if successful; otherwise, null.</returns>
    Task<string?> LoginWithTokenAsync(string email, string password);

    /// <summary>
    /// Authenticates a user and returns a JWT token and user info if successful.
    /// </summary>
    /// <param name="loginDto">The DTO containing the login information.</param>
    /// <returns>A task that represents the asynchronous operation, containing a tuple with the JWT token and UserDto if successful.</returns>
    Task<(string? Token, UserDto? User)> LoginAndGetTokenAsync(LoginDto loginDto);

    /// <summary>
    /// Gets the role name for a given role ID.
    /// </summary>
    /// <param name="roleId">The ID of the role to retrieve the name for.</param>
    /// <returns>A task that represents the asynchronous operation, containing the role name if found; otherwise, null.</returns>
    Task<string?> GetRoleNameById(int roleId);

    /// <summary>
    /// Gets the role names for a list of role IDs.
    /// </summary>
    /// <param name="roleIds">The list of role IDs to retrieve names for.</param>
    /// <returns>A task that represents the asynchronous operation, containing a list of role names.</returns>
    Task<List<string>> GetRoleNamesByIdsAsync(List<int> roleIds);

    /// <summary>
    /// Checks if the current user (by id and roles) is allowed to create a user with the specified roles.
    /// Only an Admin can create an Admin or Coach.
    /// </summary>
    /// <param name="currentUserRoles">Roles of the user making the request.</param>
    /// <param name="newUserRoleNames">Roles to assign to the new user.</param>
    /// <returns>True if allowed, false otherwise.</returns>
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
    /// <returns>A task that represents the asynchronous operation, containing the created coach User.</returns>
    Task<User> AddCoachToDojaangAsync(int requestingUserId, CreateUserDto createCoachDto);

    /// <summary>
    /// Gets the list of dojaang IDs managed by the given user (coach).
    /// </summary>
    /// <param name="coachId">The coach's user ID.</param>
    /// <returns>A task that represents the asynchronous operation, containing a list of managed dojaang IDs.</returns>
    Task<List<int>> GetManagedDojaangIdsAsync(int coachId);

    /// <summary>
    /// Gets all students belonging to a specific dojaang.
    /// </summary>
    /// <param name="dojaangId">The ID of the dojaang to retrieve students from.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of Users belonging to the specified dojaang.</returns>
    Task<IEnumerable<User>> GetStudentsByDojaangIdAsync(int dojaangId);

    /// <summary>
    /// Removes the association between a coach and a managed dojaang.
    /// </summary>
    /// <param name="coachId">The coach's user ID.</param>
    /// <param name="dojaangId">The dojaang ID to remove from management.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task RemoveCoachFromDojaangAsync(int coachId, int dojaangId);

    /// <summary>
    /// Adds a managed dojaang relation for a coach if not already present.
    /// </summary>
    /// <param name="coachId">The coach's user ID.</param>
    /// <param name="dojaangId">The dojaang ID to add to management.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task AddCoachToDojaangRelationAsync(int coachId, int dojaangId);

    /// <summary>
    /// Upserts a coach asynchronously, creating or updating the coach based on the provided DTO.
    /// </summary>
    /// <param name="requestingUserId">The ID of the user making the request.</param>
    /// <param name="dto">The DTO containing the coach information.</param>
    /// <returns>A task that represents the asynchronous operation, containing the upserted User.</returns>
    Task<User> UpsertCoachAsync(int requestingUserId, UpsertCoachDto dto);

    /// <summary>
    /// Reactivates a coach user by their user ID, typically by setting their account status to active.
    /// </summary>
    /// <param name="coachId">The ID of the coach to reactivate.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task ReactivateAsync(int coachId);
}
