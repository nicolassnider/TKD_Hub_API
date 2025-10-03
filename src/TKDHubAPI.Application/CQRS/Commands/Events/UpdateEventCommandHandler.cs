using AutoMapper;
using MediatR;
using TKDHubAPI.Application.DTOs.Event;
using TKDHubAPI.Application.Interfaces;


namespace TKDHubAPI.Application.CQRS.Commands.Events;


public class UpdateEventCommandHandler : IRequestHandler<UpdateEventCommand, EventDto>
{
    private readonly IEventService _eventService;
    private readonly IMapper _mapper;


    public UpdateEventCommandHandler(IEventService eventService, IMapper mapper)
    {
        _eventService = eventService;
        _mapper = mapper;
    }


    public async Task<EventDto> Handle(UpdateEventCommand request, CancellationToken cancellationToken)
    {
        var eventEntity = _mapper.Map<UpdateEventDto, Event>(request.UpdateEventDto);
        eventEntity.Id = request.Id;
        await _eventService.UpdateAsync(eventEntity, request.CurrentUser);
        return _mapper.Map<EventDto>(eventEntity);
    }
}
