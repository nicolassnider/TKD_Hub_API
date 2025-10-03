using MediatR;
using TKDHubAPI.Application.Interfaces;


namespace TKDHubAPI.Application.CQRS.Commands.Coaches;


public class UpdateCoachManagedDojaangsCommandHandler : IRequestHandler<UpdateCoachManagedDojaangsCommand>
{
    private readonly IUserService _userService;
    private readonly ICoachService _coachService;


    public UpdateCoachManagedDojaangsCommandHandler(IUserService userService, ICoachService coachService)
    {
        _userService = userService;
        _coachService = coachService;
    }


    public async Task Handle(UpdateCoachManagedDojaangsCommand request, CancellationToken cancellationToken)
    {
        // Get current managed dojaang IDs
        var currentManagedIds = await _userService.GetManagedDojaangIdsAsync(request.CoachId);


        // Only add new managed dojaangs not already managed
        var toAdd = request.UpdateDto.ManagedDojaangIds.Except(currentManagedIds).ToList();
        foreach (var dojaangId in toAdd)
        {
            await _coachService.AddManagedDojaangAsync(request.CoachId, dojaangId);
        }
    }
}
