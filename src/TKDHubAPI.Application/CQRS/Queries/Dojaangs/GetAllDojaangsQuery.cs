using MediatR;
using TKDHubAPI.Application.DTOs.Pagination;
using TKDHubAPI.Application.DTOs.Dojaang;


namespace TKDHubAPI.Application.CQRS.Queries.Dojaangs;


public class GetAllDojaangsQuery : IRequest<PaginatedResult<DojaangDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 0;
   
    public GetAllDojaangsQuery(int page = 1, int pageSize = 0)
    {
        Page = page;
        PageSize = pageSize;
    }
}
