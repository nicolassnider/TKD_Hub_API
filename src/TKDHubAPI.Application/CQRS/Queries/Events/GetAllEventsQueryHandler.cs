using AutoMapper;
using MediatR;
using TKDHubAPI.Application.DTOs.Pagination;
using TKDHubAPI.Application.DTOs.Event;
using TKDHubAPI.Application.Interfaces;


namespace TKDHubAPI.Application.CQRS.Queries.Events;


public class GetAllEventsQueryHandler : IRequestHandler<GetAllEventsQuery, PaginatedResult<EventDto>>
{
    private readonly IEventService _service;
    private readonly IPaginationService<EventDto> _paginationService;
    private readonly IMapper _mapper;

    public GetAllEventsQueryHandler(IEventService service, IPaginationService<EventDto> paginationService, IMapper mapper)
    {
        _service = service;
        _paginationService = paginationService;
        _mapper = mapper;
    }

    public async Task<PaginatedResult<EventDto>> Handle(GetAllEventsQuery request, CancellationToken cancellationToken)
    {
        var events = await _service.GetAllAsync();
        var eventDtos = _mapper.Map<IEnumerable<EventDto>>(events);
        return await _paginationService.PaginateAsync(eventDtos, request.Page, request.PageSize);
    }
}
