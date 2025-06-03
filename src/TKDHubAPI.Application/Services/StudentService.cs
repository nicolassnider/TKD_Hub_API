using Microsoft.AspNetCore.Identity;
using TKDHubAPI.Application.DTOs.User;

public class StudentService : IStudentService
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly PasswordHasher<User> _passwordHasher = new();
    private readonly ICurrentUserService _currentUserService;
    private const int StudentRoleId = 3;
    private const string DefaultStudentPassword = "StudentPassword123!";

    public StudentService(
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUserService currentUserService)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<UserDto> CreateStudentAsync(CreateStudentDto createStudentDto)
    {
        // Get the context user
        var contextUser = await _currentUserService.GetCurrentUserAsync();
        if (contextUser == null)
            throw new UnauthorizedAccessException("No context user found.");

        // If context user is a Coach, DojaangId must be present and managed by the coach
        if (contextUser.HasRole("Coach"))
        {
            if (createStudentDto.DojaangId == null)
                throw new ArgumentException("DojaangId is required when a coach creates a student.");
            if (!contextUser.ManagesDojaang(createStudentDto.DojaangId.Value))
                throw new UnauthorizedAccessException("Coach can only add students to dojaangs they manage.");
        }

        // Map to User entity
        var user = _mapper.Map<User>(createStudentDto);

        // Assign the Student role
        user.UserUserRoles = new List<UserUserRole>
    {
        new UserUserRole
        {
            User = user,
            UserRoleId = StudentRoleId
        }
    };

        // Set JoinDate to now if not set
        user.JoinDate = user.JoinDate ?? DateTime.UtcNow;

        // Set default password
        user.PasswordHash = _passwordHasher.HashPassword(user, DefaultStudentPassword);

        await _userRepository.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<UserDto>(user);
    }

    public async Task<UserDto?> GetStudentByIdAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null || !user.UserUserRoles.Any(r => r.UserRoleId == StudentRoleId))
            return null;
        return _mapper.Map<UserDto>(user);
    }

    public async Task<IEnumerable<UserDto>> GetStudentsByDojaangIdAsync(int dojaangId)
    {
        var students = await _userRepository.GetStudentsByDojaangIdAsync(dojaangId);
        return students.Select(_mapper.Map<UserDto>);
    }

    public async Task<IEnumerable<UserDto>> GetAllStudentsAsync()
    {
        var users = await _userRepository.GetUsersByRoleAsync("Student");
        return users.Select(_mapper.Map<UserDto>);
    }
}
