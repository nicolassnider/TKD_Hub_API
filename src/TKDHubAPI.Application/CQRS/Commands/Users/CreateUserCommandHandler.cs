using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TKDHubAPI.Application.DTOs.User;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Domain.Entities;
using TKDHubAPI.Domain.Repositories;


namespace TKDHubAPI.Application.CQRS.Commands.Users;


public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, UserDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IUserRoleRepository _userRoleRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly PasswordHasher<User> _passwordHasher = new();


    public CreateUserCommandHandler(
        IUserRepository userRepository,
        IUserRoleRepository userRoleRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _userRoleRepository = userRoleRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }


    public async Task<UserDto> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var createUserDto = request.CreateUserDto;
        var currentUserRoles = request.CurrentUserRoles;
        var requestingUserId = request.RequestingUserId;


        // Get role names for new user
        var newUserRoleNames = new List<string>();
        foreach (var roleId in createUserDto.RoleIds ?? Enumerable.Empty<int>())
        {
            var role = await _userRoleRepository.GetByIdAsync(roleId);
            if (role != null && !string.IsNullOrEmpty(role.Name))
                newUserRoleNames.Add(role.Name);
        }


        // Normalize DojaangId
        var normalizedDojaangId = NormalizeDojaangId(createUserDto.DojaangId);


        // Validation for Coach permissions
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


        // Validate student dojaang assignment
        if (await IsStudentRoleAsync(createUserDto.RoleIds) && normalizedDojaangId == null)
            throw new ArgumentException("A student must be assigned to exactly one Dojaang.");


        // Create user entity
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


        // Get roles and add automatic Student role for coaches
        var roles = await _userRoleRepository.GetRolesByIdsAsync(createUserDto.RoleIds);
       
        // Ensure coaches also have the Student role (all coaches should be students too)
        if (roles.Any(r => r.Name == "Coach"))
        {
            var studentRole = await _userRoleRepository.GetByNameAsync("Student");
            if (studentRole != null && !roles.Any(r => r.Id == studentRole.Id))
            {
                roles = roles.Append(studentRole).ToList();
            }
        }


        user.UserUserRoles = roles
            .Select(role => new UserUserRole
            {
                User = user,
                UserRole = role
            })
            .ToList();


        // Save user
        await _userRepository.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();


        // Add dojaang relationship if needed
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


    private async Task<bool> IsStudentRoleAsync(IEnumerable<int>? roleIds)
    {
        if (roleIds == null) return false;
       
        foreach (var roleId in roleIds)
        {
            var role = await _userRoleRepository.GetByIdAsync(roleId);
            if (role?.Name == "Student") return true;
        }
        return false;
    }
}
