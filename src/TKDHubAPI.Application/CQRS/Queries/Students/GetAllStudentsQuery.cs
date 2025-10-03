using MediatR;
using TKDHubAPI.Application.DTOs.Pagination;


namespace TKDHubAPI.Application.CQRS.Queries.Students;


public class GetAllStudentsQuery : IRequest<PaginatedResult<UserDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 0;

    public GetAllStudentsQuery(int page = 1, int pageSize = 0)
    {
        Page = page;
        PageSize = pageSize;
    }
}
