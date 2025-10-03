using MediatR;
using TKDHubAPI.Application.DTOs.Pagination;


namespace TKDHubAPI.Application.CQRS.Queries.Students;


public class GetAllStudentsQuery : IRequest<PaginatedResult<UserDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 0;
    public int? ExcludeClassId { get; set; }

    public GetAllStudentsQuery(int? excludeClassId = null, int page = 1, int pageSize = 0)
    {
        ExcludeClassId = excludeClassId;
        Page = page;
        PageSize = pageSize;
    }
}
