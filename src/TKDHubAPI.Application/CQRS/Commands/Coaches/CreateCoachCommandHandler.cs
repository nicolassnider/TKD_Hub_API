using AutoMapper;
using MediatR;
using TKDHubAPI.Application.DTOs.User;
using TKDHubAPI.Application.Interfaces;


namespace TKDHubAPI.Application.CQRS.Commands.Coaches;


public class CreateCoachCommandHandler : IRequestHandler<CreateCoachCommand, UserDto>
{
    private readonly IUserService _userService;
    private readonly IMapper _mapper;


    public CreateCoachCommandHandler(IUserService userService, IMapper mapper)
    {
        _userService = userService;
        _mapper = mapper;
    }


    public async Task<UserDto> Handle(CreateCoachCommand request, CancellationToken cancellationToken)
    {
        var createdCoach = await _userService.AddCoachToDojaangAsync(request.RequestingUserId, request.CreateCoachDto);
        return _mapper.Map<UserDto>(createdCoach);
    }
}
