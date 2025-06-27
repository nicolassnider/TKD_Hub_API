using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using TKDHubAPI.Application.Settings;

namespace TKDHubAPI.Application.Services;
public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IDojaangRepository _dojaangRepository;
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
        IMapper mapper,
        IDojaangRepository dojaangRepository)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _userRoleRepository = userRoleRepository;
        _jwtSettings = jwtOptions.Value;
        _mapper = mapper;
        _dojaangRepository = dojaangRepository;
    }

    // Common validation for update and delete
    private async Task ValidateUserUpdateOrDeleteAsync(User user)
    {
        // Enforce: Student must belong to only one dojaang

        if (user.HasRole("Student") && NormalizeDojaangId(user.DojaangId) == null)
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

        var normalizedDojaangId = NormalizeDojaangId(createUserDto.DojaangId);

        // Enforce: Student must belong to only one dojaang
        if (await IsStudentRoleAsync(createUserDto.RoleIds) && normalizedDojaangId == null)
            throw new Exception("A student must be assigned to exactly one Dojaang.");

        var user = new User
        {
            FirstName = createUserDto.FirstName,
            LastName = createUserDto.LastName,
            Email = createUserDto.Email,
            PhoneNumber = createUserDto.PhoneNumber,
            Gender = createUserDto.Gender,
            DojaangId = normalizedDojaangId,
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

        // Only add UserDojaang for the user's main role (e.g., Student), not for Coach due to black belt
        if (normalizedDojaangId.HasValue)
        {
            // Pick the main role for the UserDojaang relation (e.g., Student, not Coach)
            var mainRole = roles.FirstOrDefault()?.Name ?? "Student";
            user.UserDojaangs.Add(new UserDojaang
            {
                UserId = user.Id,
                DojaangId = normalizedDojaangId.Value,
                Role = mainRole
            });
            await _unitOfWork.SaveChangesAsync();
        }

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
        // This will include UserUserRoles and their UserRole due to repository implementation
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
        // Fetch the current user from the database to get the original DojaangId
        var existingUser = await _userRepository.GetByIdAsync(user.Id);
        if (existingUser == null)
            throw new Exception("User not found.");

        // If the incoming DojaangId is 0 or null, do not modify this field
        if (user.DojaangId == null || user.DojaangId == 0)
        {
            user.DojaangId = existingUser.DojaangId == 0 ? null : existingUser.DojaangId;

        }

        await ValidateUserUpdateOrDeleteAsync(user);

        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task UpdateUserFromDtoAsync(int id, UpdateUserDto updateUserDto)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
            throw new Exception("User not found.");

        var originalDojaangId = user.DojaangId;

        _mapper.Map(updateUserDto, user);

        if (updateUserDto.DojaangId == null || updateUserDto.DojaangId == 0)
        {
            user.DojaangId = originalDojaangId;
        }

        await UpdateAsync(user);
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
        var normalizedDojaangId = NormalizeDojaangId(createUserDto.DojaangId);

        if (await IsStudentRoleAsync(createUserDto.RoleIds) && normalizedDojaangId == null)
            throw new Exception("A student must be assigned to exactly one Dojaang.");

        var user = new User
        {
            FirstName = createUserDto.FirstName,
            LastName = createUserDto.LastName,
            Email = createUserDto.Email,
            PhoneNumber = createUserDto.PhoneNumber,
            Gender = createUserDto.Gender,
            DateOfBirth = createUserDto.DateOfBirth,
            DojaangId = normalizedDojaangId,
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
        if (normalizedDojaangId.HasValue)
        {
            var mainRole = roles.FirstOrDefault()?.Name ?? "Student";
            user.UserDojaangs.Add(new UserDojaang
            {
                UserId = user.Id,
                DojaangId = normalizedDojaangId.Value,
                Role = mainRole
            });
            await _unitOfWork.SaveChangesAsync();
        }

        return user;
    }

    public async Task<IEnumerable<UserDto>> GetAllWithRolesAsync()
    {
        var users = await _userRepository.GetAllAsync();

        var userDtos = users.Select(user => new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            Gender = user.Gender,
            // Map other properties as needed...
            Roles = user.UserUserRoles?
                .Where(uur => uur.UserRole != null && !string.IsNullOrEmpty(uur.UserRole.Name))
                .Select(uur => uur.UserRole.Name)
                .ToList() ?? new List<string>(),
            ManagedDojaangIds = user.UserDojaangs?
            .Select(ud => ud.DojaangId)
            .ToList() ?? new List<int>(),
            // Add other UserDto properties here as needed
            // Example:
            // FirstName = user.FirstName,
            // LastName = user.LastName,
            // etc.
            DateOfBirth = user.DateOfBirth,
            DojaangId = user.DojaangId,
            CurrentRankId = user.CurrentRankId,
            JoinDate = user.JoinDate,
            IsActive = user.IsActive,
            PhoneNumber = user.PhoneNumber,
            FirstName = user.FirstName,
            LastName = user.LastName
        }).ToList();

        return userDtos;
    }

    public async Task<string?> GetRoleNameById(int roleId)
    {
        var role = await _userRoleRepository.GetByIdAsync(roleId);
        return role?.Name;
    }

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

    public async Task<bool> CoachManagesDojaangAsync(int coachId, int dojaangId)
    {
        var coach = await _userRepository.GetByIdAsync(coachId);
        if (coach == null)
            return false;
        return coach.HasRole("Coach") && coach.ManagesDojaang(dojaangId);
    }

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
        var requestingUser = await _userRepository.GetByIdAsync(requestingUserId);
        if (requestingUser == null)
            throw new Exception("Requesting user not found.");

        var newUserRoleNames = await GetRoleNamesByIdsAsync(createCoachDto.RoleIds);

        if (!newUserRoleNames.Any(r => r.Equals("Coach", StringComparison.OrdinalIgnoreCase)))
            throw new UnauthorizedAccessException("Only coach role assignment is allowed in this operation.");

        var normalizedDojaangId = NormalizeDojaangId(createCoachDto.DojaangId);

        if (!requestingUser.HasRole("Admin"))
        {
            if (normalizedDojaangId == null || !requestingUser.ManagesDojaang(normalizedDojaangId.Value))
                throw new UnauthorizedAccessException("You can only add a coach to a dojaang you manage.");
        }

        var user = new User
        {
            FirstName = createCoachDto.FirstName,
            LastName = createCoachDto.LastName,
            Email = createCoachDto.Email,
            PhoneNumber = createCoachDto.PhoneNumber,
            Gender = createCoachDto.Gender,
            DateOfBirth = createCoachDto.DateOfBirth,
            DojaangId = normalizedDojaangId,
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

        if (normalizedDojaangId.HasValue)
        {
            user.UserDojaangs.Add(new UserDojaang
            {
                UserId = user.Id,
                DojaangId = normalizedDojaangId.Value,
                Role = "Coach"
            });
            await _unitOfWork.SaveChangesAsync();
        }

        return user;
    }

    public async Task<UserDto> CreateUserAsync(int requestingUserId, IEnumerable<string> currentUserRoles, CreateUserDto createUserDto)
    {
        var newUserRoleNames = new List<string>();
        foreach (var roleId in createUserDto.RoleIds ?? Enumerable.Empty<int>())
        {
            var roleName = await GetRoleNameById(roleId);
            if (!string.IsNullOrEmpty(roleName))
                newUserRoleNames.Add(roleName);
        }

        var normalizedDojaangId = NormalizeDojaangId(createUserDto.DojaangId);

        if (currentUserRoles.Contains("Coach") && !currentUserRoles.Contains("Admin"))
        {
            if (!newUserRoleNames.All(r => r == "Coach" || r == "Student"))
                throw new UnauthorizedAccessException("Coach can only create Coach or Student users.");

            if (newUserRoleNames.Contains("Student") && normalizedDojaangId == null)
            {
                var managedDojaangs = await GetManagedDojaangIdsAsync(requestingUserId);
                var firstDojaangId = managedDojaangs.FirstOrDefault();
                if (firstDojaangId == 0)
                    throw new ArgumentException("Coach does not manage any dojaang. Cannot assign student.");

                normalizedDojaangId = firstDojaangId;
            }

            if (normalizedDojaangId == null)
                throw new ArgumentException("DojaangId is required when a coach creates a user.");

            var manages = await CoachManagesDojaangAsync(requestingUserId, normalizedDojaangId.Value);
            if (!manages)
                throw new UnauthorizedAccessException("Coach can only create users for dojaangs they manage.");
        }

        if (await IsStudentRoleAsync(createUserDto.RoleIds) && normalizedDojaangId == null)
            throw new ArgumentException("A student must be assigned to exactly one Dojaang.");

        var user = new User
        {
            FirstName = createUserDto.FirstName,
            LastName = createUserDto.LastName,
            Email = createUserDto.Email,
            PhoneNumber = createUserDto.PhoneNumber,
            Gender = createUserDto.Gender,
            DateOfBirth = createUserDto.DateOfBirth,
            DojaangId = normalizedDojaangId,
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

        if (normalizedDojaangId.HasValue)
        {
            var mainRole = roles.FirstOrDefault()?.Name ?? "Student";
            user.UserDojaangs.Add(new UserDojaang
            {
                UserId = user.Id,
                DojaangId = normalizedDojaangId.Value,
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

    public async Task RemoveCoachFromDojaangAsync(int coachId, int dojaangId)
    {
        var user = await _userRepository.GetByIdAsync(coachId);
        if (user == null)
            throw new Exception("Coach not found.");

        // Find the UserDojaang relation for this coach and dojaang with role "Coach"
        var userDojaang = user.UserDojaangs
            .FirstOrDefault(ud => ud.DojaangId == dojaangId && ud.Role == "Coach");

        if (userDojaang == null)
            throw new Exception("Coach is not assigned to this dojaang.");

        user.UserDojaangs.Remove(userDojaang);
        _unitOfWork.SaveChangesAsync().Wait();
    }

    public async Task AddCoachToDojaangRelationAsync(int coachId, int dojaangId)
    {
        var user = await _userRepository.GetByIdAsync(coachId);
        if (user == null)
            throw new Exception("Coach not found.");

        // Validate dojaang exists
        var dojaang = await _dojaangRepository.GetByIdAsync(dojaangId);
        if (dojaang == null)
            throw new Exception($"Dojaang with Id {dojaangId} does not exist.");

        // Check if the relation already exists
        var exists = user.UserDojaangs.Any(ud => ud.DojaangId == dojaangId && ud.Role == "Coach");
        if (exists)
            return; // Skip if already exists

        user.UserDojaangs.Add(new UserDojaang
        {
            UserId = user.Id,
            DojaangId = dojaangId,
            Role = "Coach"
        });

        await _unitOfWork.SaveChangesAsync();
    }

    private int? NormalizeDojaangId(int? dojaangId)
    {
        return (dojaangId == null || dojaangId == 0) ? null : dojaangId;
    }

    public async Task<User> UpsertCoachAsync(int requestingUserId, UpsertCoachDto dto)
    {
        // Ensure at least the Coach role is present
        if (dto.RoleIds == null || !dto.RoleIds.Any())
        {
            var coachRole = await _userRoleRepository.GetByNameAsync("Coach");
            if (coachRole == null)
                throw new Exception("Coach role not found in the system.");
            dto.RoleIds = new List<int> { coachRole.Id };
        }
        if (dto.Id.HasValue && dto.Id.Value > 0)
        {
            // Update existing coach
            var user = await _userRepository.GetByIdAsync(dto.Id.Value);
            if (user == null) throw new KeyNotFoundException("Coach not found.");

            _mapper.Map(dto, user); // Use AutoMapper for property mapping

            _userRepository.Update(user);
            await _unitOfWork.SaveChangesAsync();

            // Update managed dojaangs if provided
            if (dto.ManagedDojaangIds != null)
            {
                // Remove existing coach relations not in the new list
                var toRemove = user.UserDojaangs
                    .Where(ud => ud.Role == "Coach" && !dto.ManagedDojaangIds.Contains(ud.DojaangId))
                    .ToList();
                foreach (var rel in toRemove)
                    user.UserDojaangs.Remove(rel);

                // Add new relations
                foreach (var dojaangId in dto.ManagedDojaangIds)
                {
                    if (!user.UserDojaangs.Any(ud => ud.DojaangId == dojaangId && ud.Role == "Coach"))
                    {
                        user.UserDojaangs.Add(new UserDojaang
                        {
                            UserId = user.Id,
                            DojaangId = dojaangId,
                            Role = "Coach"
                        });
                    }
                }
                await _unitOfWork.SaveChangesAsync();
            }

            return user;
        }
        else
        {
            // Create new coach with default password
            var createDto = new CreateUserDto
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Password = "coachPassword123!", // Set default password
                PhoneNumber = dto.PhoneNumber,
                Gender = dto.Gender,
                DateOfBirth = dto.DateOfBirth,
                DojaangId = dto.DojaangId,
                RankId = dto.RankId,
                JoinDate = dto.JoinDate,
                RoleIds = dto.RoleIds
            };

            var user = await AddCoachToDojaangAsync(requestingUserId, createDto);

            // Add managed dojaangs if provided
            if (dto.ManagedDojaangIds != null)
            {
                foreach (var dojaangId in dto.ManagedDojaangIds)
                {
                    user.UserDojaangs.Add(new UserDojaang
                    {
                        UserId = user.Id,
                        DojaangId = dojaangId,
                        Role = "Coach"
                    });
                }
                await _unitOfWork.SaveChangesAsync();
            }

            return user;
        }
    }

    public async Task ReactivateAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            throw new Exception("User not found.");

        user.IsActive = true;
        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<IEnumerable<UserUserRole>> GetUserUserRolesAsync(int userId)
    {
        return await _userRepository.GetUserUserRolesAsync(userId);
    }

    public async Task AddUserUserRoleAsync(UserUserRole userUserRole)
    {
        await _userRepository.AddUserUserRoleAsync(userUserRole);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task RemoveUserUserRoleAsync(int userId, int userRoleId)
    {
        await _userRepository.RemoveUserUserRoleAsync(userId, userRoleId);
        await _unitOfWork.SaveChangesAsync();
    }
}
