using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TKDHubAPI.Application.DTOs.User;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Domain.Entities;
using TKDHubAPI.Domain.Repositories;


namespace TKDHubAPI.Application.CQRS.Commands.Students;


public class CreateStudentCommandHandler : IRequestHandler<CreateStudentCommand, UserDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IUserRoleRepository _userRoleRepository;
    private readonly IRankRepository _rankRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly PasswordHasher<User> _passwordHasher = new();


    public CreateStudentCommandHandler(
        IUserRepository userRepository,
        IUserRoleRepository userRoleRepository,
        IRankRepository rankRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _userRoleRepository = userRoleRepository;
        _rankRepository = rankRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }


    public async Task<UserDto> Handle(CreateStudentCommand request, CancellationToken cancellationToken)
    {
        var createStudentDto = request.CreateStudentDto;
        var currentUserRoles = request.CurrentUserRoles;
        var requestingUserId = request.RequestingUserId;


        // Normalize DojaangId
        var normalizedDojaangId = NormalizeDojaangId(createStudentDto.DojaangId);


        // Validation for Coach permissions
        if (currentUserRoles.Contains("Coach") && !currentUserRoles.Contains("Admin"))
        {
            if (normalizedDojaangId == null)
            {
                var managedDojaangs = await GetManagedDojaangIdsAsync(requestingUserId);
                var firstDojaangId = managedDojaangs.FirstOrDefault();
                if (firstDojaangId == 0)
                    throw new ArgumentException("Coach does not manage any dojaang. Cannot create student.");


                normalizedDojaangId = firstDojaangId;
            }


            if (normalizedDojaangId == null)
                throw new ArgumentException("DojaangId is required when a coach creates a student.");


            var manages = await CoachManagesDojaangAsync(requestingUserId, normalizedDojaangId.Value);
            if (!manages)
                throw new UnauthorizedAccessException("Coach can only create students for dojaangs they manage.");
        }


        // Ensure student is assigned to a dojaang
        if (normalizedDojaangId == null)
            throw new ArgumentException("A student must be assigned to exactly one Dojaang.");


        // Create user entity for the student
        var user = new User
        {
            FirstName = createStudentDto.FirstName,
            LastName = createStudentDto.LastName,
            Email = createStudentDto.Email,
            PhoneNumber = createStudentDto.PhoneNumber,
            Gender = createStudentDto.Gender,
            DateOfBirth = createStudentDto.DateOfBirth,
            DojaangId = normalizedDojaangId,
            CurrentRankId = createStudentDto.RankId,
            JoinDate = DateTime.UtcNow,
            PasswordHash = string.Empty // Students might not have passwords initially
        };


        // Get Student role
        var studentRole = await _userRoleRepository.GetByNameAsync("Student");
        if (studentRole == null)
            throw new InvalidOperationException("Student role not found.");


        var roles = new List<UserRole> { studentRole };


        // Check if student has black belt and should become a coach
        if (createStudentDto.RankId.HasValue)
        {
            var rank = await _rankRepository.GetByIdAsync(createStudentDto.RankId.Value);
            if (rank != null && IsBlackBelt(rank))
            {
                // Add Coach role for black belts
                var coachRole = await _userRoleRepository.GetByNameAsync("Coach");
                if (coachRole != null)
                {
                    roles.Add(coachRole);
                }
            }
        }


        // Assign roles to user
        user.UserUserRoles = roles
            .Select(role => new UserUserRole
            {
                User = user,
                UserRole = role
            })
            .ToList();


        // Save user
        await _userRepository.AddAsync(user);


        // Add dojaang relationship
        if (normalizedDojaangId.HasValue)
        {
            user.UserDojaangs.Add(new UserDojaang
            {
                UserId = user.Id,
                DojaangId = normalizedDojaangId.Value,
                Role = "Student"
            });
        }


        await _unitOfWork.SaveChangesAsync();


        // Return DTO
        var userDto = _mapper.Map<UserDto>(user);
        userDto.Roles = roles.Select(r => r.Name).ToList();
        return userDto;
    }


    private static int? NormalizeDojaangId(int? dojaangId)
    {
        return dojaangId == 0 ? null : dojaangId;
    }


    private async Task<List<int>> GetManagedDojaangIdsAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return new List<int>();
        return user.UserDojaangs.Select(ud => ud.DojaangId).ToList();
    }


    private async Task<bool> CoachManagesDojaangAsync(int coachId, int dojaangId)
    {
        var user = await _userRepository.GetByIdAsync(coachId);
        return user?.ManagesDojaang(dojaangId) ?? false;
    }


    private static bool IsBlackBelt(Rank rank)
    {
        // Check if this is a black belt rank (Dan levels)
        return rank.DanLevel.HasValue && rank.DanLevel.Value >= 1;
    }
}
