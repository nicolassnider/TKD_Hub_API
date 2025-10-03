using MediatR;
using TKDHubAPI.Application.DTOs.Pagination;
using TKDHubAPI.Application.DTOs.User;


namespace TKDHubAPI.Application.CQRS.Queries.Users;


public class GetAllUsersQuery : IRequest<PaginatedResult<UserDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 0;
   
    public GetAllUsersQuery(int page = 1, int pageSize = 0)
    {
        Page = page;
        PageSize = pageSize;
    }
}
