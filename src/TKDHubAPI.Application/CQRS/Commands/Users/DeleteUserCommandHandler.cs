using MediatR;
using TKDHubAPI.Application.Interfaces;


namespace TKDHubAPI.Application.CQRS.Commands.Users;


public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, Unit>
{
    private readonly IUserService _userService;


    public DeleteUserCommandHandler(IUserService userService)
    {
        _userService = userService;
    }


    public async Task<Unit> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        await _userService.DeleteAsync(request.Id);
        return Unit.Value;
    }
}
