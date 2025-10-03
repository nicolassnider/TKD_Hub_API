using MediatR;
using TKDHubAPI.Application.DTOs.Event;
using TKDHubAPI.Domain.Entities;


namespace TKDHubAPI.Application.CQRS.Commands.Events;


public class CreateEventCommand : IRequest<EventDto>
{
    public CreateEventDto CreateEventDto { get; set; } = null!;
    public User CurrentUser { get; set; } = null!;
}
