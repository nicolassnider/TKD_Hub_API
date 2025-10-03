using AutoMapper;
using MediatR;
using TKDHubAPI.Application.DTOs.User;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Domain.Repositories;


namespace TKDHubAPI.Application.CQRS.Commands.Users;


public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, UserDto>
{
    private readonly IUserService _userService;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;


    public UpdateUserCommandHandler(
        IUserService userService,
        IUserRepository userRepository,
        IMapper mapper)
    {
        _userService = userService;
        _userRepository = userRepository;
        _mapper = mapper;
    }


    public async Task<UserDto> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        // Update the user using the UpdateUserDto
        await _userService.UpdateUserFromDtoAsync(request.Id, request.UpdateUserDto);
       
        // Retrieve and return the updated user
        var updatedUser = await _userRepository.GetByIdAsync(request.Id);
        return _mapper.Map<UserDto>(updatedUser);
    }
}
