using MediatR;
using TKDHubAPI.Application.DTOs.Pagination;

namespace TKDHubAPI.Application.CQRS.Queries.Coaches;

public class GetAllCoachesQuery : IRequest<PaginatedResult<UserDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 0;
    public bool IncludeInactive { get; set; } = false;

    public GetAllCoachesQuery(int page = 1, int pageSize = 0, bool includeInactive = false)
    {
        Page = page;
        PageSize = pageSize;
        IncludeInactive = includeInactive;
    }
}
