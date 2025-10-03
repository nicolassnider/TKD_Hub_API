using MediatR;


namespace TKDHubAPI.Application.CQRS.Queries.Users;


public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, UserDto?>
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;


    public GetUserByIdQueryHandler(IUserRepository userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }


    public async Task<UserDto?> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.Id);

        if (user == null)
            return null;


        var userDto = _mapper.Map<UserDto>(user);

        // Map roles
        userDto.Roles = user.UserUserRoles?.Select(ur => ur.UserRole.Name).ToList() ?? new List<string>();

        return userDto;
    }
}
