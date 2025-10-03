using MediatR;
using TKDHubAPI.Application.DTOs.Event;
using TKDHubAPI.Domain.Entities;


namespace TKDHubAPI.Application.CQRS.Commands.Events;


public class UpdateEventCommand : IRequest<EventDto>
{
    public int Id { get; set; }
    public UpdateEventDto UpdateEventDto { get; set; } = null!;
    public User CurrentUser { get; set; } = null!;
}
