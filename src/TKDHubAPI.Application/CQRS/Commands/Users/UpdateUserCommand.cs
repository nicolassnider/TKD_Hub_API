using MediatR;
using TKDHubAPI.Application.DTOs.User;


namespace TKDHubAPI.Application.CQRS.Commands.Users;


public class UpdateUserCommand : IRequest<UserDto>
{
    public int Id { get; set; }
    public UpdateUserDto UpdateUserDto { get; set; } = null!;
    public int RequestingUserId { get; set; }
    public IEnumerable<string> CurrentUserRoles { get; set; } = Enumerable.Empty<string>();
}
