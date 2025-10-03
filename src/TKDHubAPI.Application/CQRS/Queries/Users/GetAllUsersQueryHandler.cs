using AutoMapper;
using MediatR;
using TKDHubAPI.Application.DTOs.Pagination;
using TKDHubAPI.Application.DTOs.User;
using TKDHubAPI.Application.Interfaces;


namespace TKDHubAPI.Application.CQRS.Queries.Users;


public class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, PaginatedResult<UserDto>>
{
    private readonly IUserService _service;
    private readonly IMapper _mapper;


    public GetAllUsersQueryHandler(IUserService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }


    public async Task<PaginatedResult<UserDto>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        return await _service.GetAllAsync(request.Page, request.PageSize);
    }
}
