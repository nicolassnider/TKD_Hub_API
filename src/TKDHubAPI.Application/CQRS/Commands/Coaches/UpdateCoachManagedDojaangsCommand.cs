using MediatR;
using TKDHubAPI.Application.DTOs.User;


namespace TKDHubAPI.Application.CQRS.Commands.Coaches;


public class UpdateCoachManagedDojaangsCommand : IRequest
{
    public int CoachId { get; set; }
    public UpdateCoachManagedDojaangsDto UpdateDto { get; set; } = null!;
}
