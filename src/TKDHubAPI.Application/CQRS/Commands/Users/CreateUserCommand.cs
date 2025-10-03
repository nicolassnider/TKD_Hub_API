using MediatR;
using TKDHubAPI.Application.DTOs.User;


namespace TKDHubAPI.Application.CQRS.Commands.Users;


public class CreateUserCommand : IRequest<UserDto>
{
    public int RequestingUserId { get; set; }
    public IEnumerable<string> CurrentUserRoles { get; set; } = new List<string>();
    public CreateUserDto CreateUserDto { get; set; } = new();


    public CreateUserCommand(int requestingUserId, IEnumerable<string> currentUserRoles, CreateUserDto createUserDto)
    {
        RequestingUserId = requestingUserId;
        CurrentUserRoles = currentUserRoles;
        CreateUserDto = createUserDto;
    }
}
