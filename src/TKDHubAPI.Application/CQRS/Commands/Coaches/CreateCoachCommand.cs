using MediatR;
using TKDHubAPI.Application.DTOs.User;


namespace TKDHubAPI.Application.CQRS.Commands.Coaches;


public class CreateCoachCommand : IRequest<UserDto>
{
    public int RequestingUserId { get; set; }
    public CreateUserDto CreateCoachDto { get; set; } = null!;
}
