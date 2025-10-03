using MediatR;
using TKDHubAPI.Application.DTOs.Pagination;


namespace TKDHubAPI.Application.CQRS.Queries.Coaches;


public class GetAllCoachesQuery : IRequest<PaginatedResult<UserDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 0;

    public GetAllCoachesQuery(int page = 1, int pageSize = 0)
    {
        Page = page;
        PageSize = pageSize;
    }
}
