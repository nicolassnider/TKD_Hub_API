using MediatR;
using TKDHubAPI.Application.DTOs.Pagination;
using TKDHubAPI.Application.DTOs.Event;


namespace TKDHubAPI.Application.CQRS.Queries.Events;


public class GetAllEventsQuery : IRequest<PaginatedResult<EventDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 0;
   
    public GetAllEventsQuery(int page = 1, int pageSize = 0)
    {
        Page = page;
        PageSize = pageSize;
    }
}
