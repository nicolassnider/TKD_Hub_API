using MediatR;


namespace TKDHubAPI.Application.CQRS.Commands.Coaches;


public class DeleteCoachCommand : IRequest
{
    public int CoachId { get; set; }
}
