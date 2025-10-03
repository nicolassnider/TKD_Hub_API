namespace TKDHubAPI.Application.Services;
public class StudentService : IStudentService
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly PasswordHasher<User> _passwordHasher = new();
    private readonly ICurrentUserService _currentUserService;
    private const int StudentRoleId = 3;
    private const int CoachRoleId = 2;
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


        // Check if student has black belt rank (DanLevel is not null) and add Coach role
        if (user.CurrentRankId.HasValue)
        {
            var rank = await _unitOfWork.Ranks.GetByIdAsync(user.CurrentRankId.Value);
            if (rank?.DanLevel.HasValue == true)
            {
                // Add Coach role for black belt students
                user.UserUserRoles.Add(new UserUserRole
                {
                    User = user,
                    UserRoleId = CoachRoleId
                });
            }
        }


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


    public async Task<IEnumerable<UserDto>> GetStudentsNotInClassAsync(int classId)
    {
        // Get all students
        var allStudents = await _userRepository.GetUsersByRoleAsync("Student");
       
        // Get students enrolled in the specific class
        var enrolledStudentIds = await _userRepository.GetStudentIdsByClassIdAsync(classId);
       
        // Filter out enrolled students
        var availableStudents = allStudents.Where(s => !enrolledStudentIds.Contains(s.Id));
       
        return availableStudents.Select(_mapper.Map<UserDto>);
    }


    public async Task<UserDto?> UpdateStudentAsync(int id, UpdateStudentDto updateStudentDto)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null || !user.UserUserRoles.Any(r => r.UserRoleId == StudentRoleId))
            return null;


        // Store the old DojaangId before mapping
        var oldDojaangId = user.DojaangId;


        _mapper.Map(updateStudentDto, user);


        // If DojaangId has changed, update UserDojaangs relation
        if (updateStudentDto.DojaangId.HasValue && updateStudentDto.DojaangId != oldDojaangId)
        {
            // Remove previous student-dojaang relations
            var oldRelations = user.UserDojaangs
                .Where(ud => ud.Role == "Student")
                .ToList();
            foreach (var rel in oldRelations)
                user.UserDojaangs.Remove(rel);


            // Add new relation if DojaangId is set
            if (updateStudentDto.DojaangId.Value != 0)
            {
                user.UserDojaangs.Add(new UserDojaang
                {
                    UserId = user.Id,
                    DojaangId = updateStudentDto.DojaangId.Value,
                    Role = "Student"
                });
            }
        }


        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();


        return _mapper.Map<UserDto>(user);
    }
}
