using MediatR;
using TKDHubAPI.Application.Interfaces;


namespace TKDHubAPI.Application.CQRS.Commands.Coaches;


public class DeleteCoachCommandHandler : IRequestHandler<DeleteCoachCommand>
{
    private readonly IUserService _userService;


    public DeleteCoachCommandHandler(IUserService userService)
    {
        _userService = userService;
    }


    public async Task Handle(DeleteCoachCommand request, CancellationToken cancellationToken)
    {
        await _userService.DeleteAsync(request.CoachId);
    }
}
