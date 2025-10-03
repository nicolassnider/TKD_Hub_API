using MediatR;
using TKDHubAPI.Application.DTOs.Event;


namespace TKDHubAPI.Application.CQRS.Queries.Events;


public class GetEventByIdQueryHandler : IRequestHandler<GetEventByIdQuery, EventDto?>
{
    private readonly IEventService _eventService;
    private readonly IMapper _mapper;


    public GetEventByIdQueryHandler(IEventService eventService, IMapper mapper)
    {
        _eventService = eventService;
        _mapper = mapper;
    }


    public async Task<EventDto?> Handle(GetEventByIdQuery request, CancellationToken cancellationToken)
    {
        var eventEntity = await _eventService.GetByIdAsync(request.Id);
        return eventEntity != null ? _mapper.Map<EventDto>(eventEntity) : null;
    }
}
