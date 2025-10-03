using AutoMapper;
using MediatR;
using TKDHubAPI.Application.DTOs.Pagination;
using TKDHubAPI.Application.DTOs.Event;
using TKDHubAPI.Application.Interfaces;


namespace TKDHubAPI.Application.CQRS.Queries.Events;


public class GetAllEventsQueryHandler : IRequestHandler<GetAllEventsQuery, PaginatedResult<EventDto>>
{
    private readonly IEventService _service;
    private readonly IMapper _mapper;


    public GetAllEventsQueryHandler(IEventService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }


    public async Task<PaginatedResult<EventDto>> Handle(GetAllEventsQuery request, CancellationToken cancellationToken)
    {
        return await _service.GetAllAsync(request.Page, request.PageSize);
    }
}
