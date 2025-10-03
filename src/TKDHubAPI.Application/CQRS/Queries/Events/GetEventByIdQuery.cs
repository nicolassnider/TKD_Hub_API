using MediatR;
using TKDHubAPI.Application.DTOs.Event;


namespace TKDHubAPI.Application.CQRS.Queries.Events;


public class GetEventByIdQuery : IRequest<EventDto?>
{
    public int Id { get; set; }
}
