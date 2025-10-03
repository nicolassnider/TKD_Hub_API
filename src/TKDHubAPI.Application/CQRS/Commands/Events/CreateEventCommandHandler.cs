using AutoMapper;
using MediatR;
using TKDHubAPI.Application.DTOs.Event;
using TKDHubAPI.Application.Interfaces;


namespace TKDHubAPI.Application.CQRS.Commands.Events;


public class CreateEventCommandHandler : IRequestHandler<CreateEventCommand, EventDto>
{
    private readonly IEventService _eventService;
    private readonly IMapper _mapper;


    public CreateEventCommandHandler(IEventService eventService, IMapper mapper)
    {
        _eventService = eventService;
        _mapper = mapper;
    }


    public async Task<EventDto> Handle(CreateEventCommand request, CancellationToken cancellationToken)
    {
        var eventEntity = _mapper.Map<Event>(request.CreateEventDto);
        await _eventService.AddAsync(eventEntity, request.CurrentUser);
        return _mapper.Map<EventDto>(eventEntity);
    }
}
