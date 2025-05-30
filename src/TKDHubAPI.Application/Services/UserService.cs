using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TKDHubAPI.Application.DTOs.User;
using TKDHubAPI.Application.Settings;

namespace TKDHubAPI.Application.Services;
public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserRoleRepository _userRoleRepository;
    private readonly PasswordHasher<User> _passwordHasher = new();
    private readonly JwtSettings _jwtSettings;
    private readonly IMapper _mapper;

    public UserService(
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        IUserRoleRepository userRoleRepository,
        IOptions<JwtSettings> jwtOptions,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _userRoleRepository = userRoleRepository;
        _jwtSettings = jwtOptions.Value;
        _mapper = mapper;
    }

    // Common validation for update and delete
    private async Task ValidateUserUpdateOrDeleteAsync(User user)
    {
        // Enforce: Student must belong to only one dojaang
        if (user.HasRole("Student") && user.DojaangId == null)
            throw new Exception("A student must be assigned to exactly one Dojaang.");

        // Add more shared business rules here as needed
        // Example: Prevent deleting last admin, etc.
    }

    public async Task<List<int>> GetManagedDojaangIdsAsync(int coachId)
    {
        var user = await _userRepository.GetByIdAsync(coachId);
        if (user == null || user.UserDojaangs == null)
            return new List<int>();

        return user.UserDojaangs.Select(ud => ud.DojaangId).ToList();
    }

    public async Task<User?> RegisterAsync(CreateUserDto createUserDto, string password)
    {
        var existingUser = await _userRepository.GetUserByEmailAsync(createUserDto.Email);
        if (existingUser != null)
            return null;

        // Enforce: Student must belong to only one dojaang
        if (await IsStudentRoleAsync(createUserDto.RoleIds) && createUserDto.DojaangId == null)
            throw new Exception("A student must be assigned to exactly one Dojaang.");

        var user = new User
        {
            FirstName = createUserDto.FirstName,
            LastName = createUserDto.LastName,
            Email = createUserDto.Email,
            PhoneNumber = createUserDto.PhoneNumber,
            Gender = createUserDto.Gender,
            DojaangId = createUserDto.DojaangId,
            CurrentRankId = createUserDto.RankId,
            JoinDate = DateTime.UtcNow,
            PasswordHash = _passwordHasher.HashPassword(null, password)
        };

        var roles = await _userRoleRepository.GetRolesByIdsAsync(createUserDto.RoleIds);
        user.UserUserRoles = roles
            .Select(role => new UserUserRole
            {
                User = user,
                UserRole = role
            })
            .ToList();

        await _userRepository.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return user;
    }

    public async Task<User?> LoginAsync(string email, string password)
    {
        var user = await _userRepository.GetUserByEmailAsync(email);
        if (user == null)
            return null;

        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
        return result == PasswordVerificationResult.Success ? user : null;
    }

    public async Task<string?> LoginWithTokenAsync(string email, string password)
    {
        var user = await LoginAsync(email, password);
        if (user == null)
            return null;

        var roles = user.UserUserRoles?.Select(uur => uur.UserRole.Name).ToList() ?? new List<string>();
        return GenerateJwtToken(user, roles);
    }

    private string GenerateJwtToken(User user, List<string> roles)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}")
        };

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiresInMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _userRepository.GetAllAsync();
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _userRepository.GetByIdAsync(id);
    }

    public async Task<User> GetUserByEmailAsync(string email)
    {
        var user = await _userRepository.GetUserByEmailAsync(email);
        if (user == null)
            throw new Exception($"User with email {email} not found");
        return user;
    }

    public async Task<User> GetUserByPhoneNumberAsync(string phoneNumber)
    {
        var user = await _userRepository.GetUserByPhoneNumberAsync(phoneNumber);
        if (user == null)
            throw new Exception($"User with phone number {phoneNumber} not found");
        return user;
    }

    public async Task<IEnumerable<User>> GetUsersByRoleAsync(string roleName)
    {
        return await _userRepository.GetUsersByRoleAsync(roleName);
    }

    public async Task AddAsync(User user)
    {
        await _userRepository.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task UpdateAsync(User user)
    {
        await ValidateUserUpdateOrDeleteAsync(user);

        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user != null)
        {
            await ValidateUserUpdateOrDeleteAsync(user);

            _userRepository.Remove(user);
            await _unitOfWork.SaveChangesAsync();
        }
    }

    public Task<IEnumerable<User>> GetUsersByGenderAsync(Gender gender)
    {
        return _userRepository.GetUsersByGenderAsync(gender);
    }

    public async Task<User> AddUserWithRolesAsync(CreateUserDto createUserDto)
    {
        // Enforce: Student must belong to only one dojaang
        if (await IsStudentRoleAsync(createUserDto.RoleIds) && createUserDto.DojaangId == null)
            throw new Exception("A student must be assigned to exactly one Dojaang.");

        var user = new User
        {
            FirstName = createUserDto.FirstName,
            LastName = createUserDto.LastName,
            Email = createUserDto.Email,
            PhoneNumber = createUserDto.PhoneNumber,
            Gender = createUserDto.Gender,
            DateOfBirth = createUserDto.DateOfBirth,
            DojaangId = createUserDto.DojaangId,
            CurrentRankId = createUserDto.RankId,
            JoinDate = createUserDto.JoinDate ?? DateTime.UtcNow,
            PasswordHash = !string.IsNullOrEmpty(createUserDto.Password)
                ? _passwordHasher.HashPassword(null, createUserDto.Password)
                : string.Empty
        };

        var roles = await _userRoleRepository.GetRolesByIdsAsync(createUserDto.RoleIds);
        user.UserUserRoles = roles
            .Select(role => new UserUserRole
            {
                User = user,
                UserRole = role
            })
            .ToList();

        await _userRepository.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        // Add UserDojaang relation if DojaangId is present
        if (createUserDto.DojaangId.HasValue)
        {
            // Determine the user's main role for this dojaang
            var mainRole = roles.FirstOrDefault()?.Name ?? "Student"; // Default to Student if not specified

            user.UserDojaangs.Add(new UserDojaang
            {
                UserId = user.Id,
                DojaangId = createUserDto.DojaangId.Value,
                Role = mainRole
            });
            await _unitOfWork.SaveChangesAsync();
        }

        return user;
    }

    public async Task<string?> GetRoleNameById(int roleId)
    {
        var role = await _userRoleRepository.GetByIdAsync(roleId);
        return role?.Name;
    }

    /// <summary>
    /// Only an Admin can assign Admin or Coach roles.
    /// </summary>
    public bool CanAssignRoles(IEnumerable<string> currentUserRoles, IEnumerable<string> newUserRoleNames)
    {
        var sensitiveRoles = new[] { "Admin", "Coach" };
        bool isAssigningSensitive = newUserRoleNames.Any(r => sensitiveRoles.Contains(r, StringComparer.OrdinalIgnoreCase));
        bool isAdmin = currentUserRoles.Any(r => r.Equals("Admin", StringComparison.OrdinalIgnoreCase));
        return !isAssigningSensitive || isAdmin;
    }

    public async Task<(string? Token, UserDto? User)> LoginAndGetTokenAsync(LoginDto loginDto)
    {
        var user = await LoginAsync(loginDto.Email, loginDto.Password);
        if (user == null)
            return (null, null);

        var roles = user.UserUserRoles?.Select(uur => uur.UserRole.Name).ToList() ?? new List<string>();
        var token = GenerateJwtToken(user, roles);

        var userDto = _mapper.Map<UserDto>(user);
        userDto.Roles = roles;

        return (token, userDto);
    }

    public async Task<List<string>> GetRoleNamesByIdsAsync(List<int> roleIds)
    {
        var roles = await _userRoleRepository.GetRolesByIdsAsync(roleIds);
        return roles.Select(r => r.Name).ToList();
    }

    /// <summary>
    /// Checks if a user (coach) manages a specific dojaang.
    /// </summary>
    public async Task<bool> CoachManagesDojaangAsync(int coachId, int dojaangId)
    {
        var coach = await _userRepository.GetByIdAsync(coachId);
        if (coach == null)
            return false;
        return coach.HasRole("Coach") && coach.ManagesDojaang(dojaangId);
    }

    /// <summary>
    /// Checks if the given role IDs include the Student role.
    /// </summary>
    private async Task<bool> IsStudentRoleAsync(IEnumerable<int> roleIds)
    {
        var roles = await _userRoleRepository.GetRolesByIdsAsync(roleIds);
        return roles.Any(r => r.Name.Equals("Student", StringComparison.OrdinalIgnoreCase));
    }

    public bool CanManageDojaang(User user, int dojaangId)
    {
        // Admins can manage any dojaang
        if (user.HasRole("Admin"))
            return true;

        // Coaches/students: check if they are linked to the dojaang
        return user.UserDojaangs.Any(ud => ud.DojaangId == dojaangId && ud.Role == "Coach");
    }

    public async Task<User> AddCoachToDojaangAsync(int requestingUserId, CreateUserDto createCoachDto)
    {
        // Get the requesting user (coach or admin)
        var requestingUser = await _userRepository.GetByIdAsync(requestingUserId);
        if (requestingUser == null)
            throw new Exception("Requesting user not found.");

        // Get the role names to assign
        var newUserRoleNames = await GetRoleNamesByIdsAsync(createCoachDto.RoleIds);

        // Only allow if the new user is a coach
        if (!newUserRoleNames.Any(r => r.Equals("Coach", StringComparison.OrdinalIgnoreCase)))
            throw new UnauthorizedAccessException("Only coach role assignment is allowed in this operation.");

        // Admins can add a coach to any dojaang
        if (!requestingUser.HasRole("Admin"))
        {
            // Coaches can only add a coach to dojaangs they manage
            if (createCoachDto.DojaangId == null || !requestingUser.ManagesDojaang(createCoachDto.DojaangId.Value))
                throw new UnauthorizedAccessException("You can only add a coach to a dojaang you manage.");
        }

        // Proceed to create the coach user
        var user = new User
        {
            FirstName = createCoachDto.FirstName,
            LastName = createCoachDto.LastName,
            Email = createCoachDto.Email,
            PhoneNumber = createCoachDto.PhoneNumber,
            Gender = createCoachDto.Gender,
            DateOfBirth = createCoachDto.DateOfBirth,
            DojaangId = createCoachDto.DojaangId,
            CurrentRankId = createCoachDto.RankId,
            JoinDate = createCoachDto.JoinDate ?? DateTime.UtcNow,
            PasswordHash = _passwordHasher.HashPassword(null, createCoachDto.Password)
        };

        var roles = await _userRoleRepository.GetRolesByIdsAsync(createCoachDto.RoleIds);
        user.UserUserRoles = roles
            .Select(role => new UserUserRole
            {
                User = user,
                UserRole = role
            })
            .ToList();

        await _userRepository.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        // Optionally, add to UserDojaangs as a coach for the dojaang
        if (createCoachDto.DojaangId.HasValue)
        {
            user.UserDojaangs.Add(new UserDojaang
            {
                UserId = user.Id,
                DojaangId = createCoachDto.DojaangId.Value,
                Role = "Coach"
            });
            await _unitOfWork.SaveChangesAsync();
        }

        return user;
    }

    /// <summary>
    /// Business rule: Handles user creation with all role and dojaang assignment logic.
    /// </summary>
    public async Task<UserDto> CreateUserAsync(int requestingUserId, IEnumerable<string> currentUserRoles, CreateUserDto createUserDto)
    {
        // Get new user role names
        var newUserRoleNames = new List<string>();
        foreach (var roleId in createUserDto.RoleIds ?? Enumerable.Empty<int>())
        {
            var roleName = await GetRoleNameById(roleId);
            if (!string.IsNullOrEmpty(roleName))
                newUserRoleNames.Add(roleName);
        }

        // Students cannot create users
        if (currentUserRoles.Contains("Student") && !currentUserRoles.Contains("Admin") && !currentUserRoles.Contains("Coach"))
            throw new UnauthorizedAccessException("Students cannot create users.");

        // If current user is Coach (but not Admin), can only create Coach/Student for dojaangs they manage
        if (currentUserRoles.Contains("Coach") && !currentUserRoles.Contains("Admin"))
        {
            if (!newUserRoleNames.All(r => r == "Coach" || r == "Student"))
                throw new UnauthorizedAccessException("Coach can only create Coach or Student users.");

            // If creating a student and DojaangId is not provided, assign to first managed dojaang
            if (newUserRoleNames.Contains("Student") && createUserDto.DojaangId == null)
            {
                var managedDojaangs = await GetManagedDojaangIdsAsync(requestingUserId);
                var firstDojaangId = managedDojaangs.FirstOrDefault();
                if (firstDojaangId == 0)
                    throw new ArgumentException("Coach does not manage any dojaang. Cannot assign student.");

                createUserDto.DojaangId = firstDojaangId;
            }

            if (createUserDto.DojaangId == null)
                throw new ArgumentException("DojaangId is required when a coach creates a user.");

            var manages = await CoachManagesDojaangAsync(requestingUserId, createUserDto.DojaangId.Value);
            if (!manages)
                throw new UnauthorizedAccessException("Coach can only create users for dojaangs they manage.");
        }

        // Only Admin can create Admins or Coaches for any dojaang
        if (newUserRoleNames.Any(r => r == "Admin" || r == "Coach"))
        {
            if (!currentUserRoles.Contains("Admin"))
                throw new UnauthorizedAccessException("Only an Admin can create Admin or Coach users.");
        }

        // Enforce: Student must belong to only one dojaang
        if (await IsStudentRoleAsync(createUserDto.RoleIds) && createUserDto.DojaangId == null)
            throw new ArgumentException("A student must be assigned to exactly one Dojaang.");

        // Create user
        var user = new User
        {
            FirstName = createUserDto.FirstName,
            LastName = createUserDto.LastName,
            Email = createUserDto.Email,
            PhoneNumber = createUserDto.PhoneNumber,
            Gender = createUserDto.Gender,
            DateOfBirth = createUserDto.DateOfBirth,
            DojaangId = createUserDto.DojaangId,
            CurrentRankId = createUserDto.RankId,
            JoinDate = createUserDto.JoinDate ?? DateTime.UtcNow,
            PasswordHash = !string.IsNullOrEmpty(createUserDto.Password)
                ? _passwordHasher.HashPassword(null, createUserDto.Password)
                : string.Empty
        };

        var roles = await _userRoleRepository.GetRolesByIdsAsync(createUserDto.RoleIds);
        user.UserUserRoles = roles
            .Select(role => new UserUserRole
            {
                User = user,
                UserRole = role
            })
            .ToList();

        await _userRepository.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        // Add UserDojaang relation if DojaangId is present
        if (createUserDto.DojaangId.HasValue)
        {
            var mainRole = roles.FirstOrDefault()?.Name ?? "Student";
            user.UserDojaangs.Add(new UserDojaang
            {
                UserId = user.Id,
                DojaangId = createUserDto.DojaangId.Value,
                Role = mainRole
            });
            await _unitOfWork.SaveChangesAsync();
        }

        var userDto = _mapper.Map<UserDto>(user);
        userDto.Roles = roles.Select(r => r.Name).ToList();
        return userDto;
    }

    public async Task<IEnumerable<User>> GetStudentsByDojaangIdAsync(int dojaangId)
    {
        return await _userRepository.GetStudentsByDojaangIdAsync(dojaangId);
    }
}
