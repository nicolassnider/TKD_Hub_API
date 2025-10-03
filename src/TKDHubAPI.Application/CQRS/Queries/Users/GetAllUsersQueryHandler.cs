using AutoMapper;
using MediatR;
using TKDHubAPI.Application.DTOs.Pagination;
using TKDHubAPI.Application.DTOs.User;
using TKDHubAPI.Application.Interfaces;


namespace TKDHubAPI.Application.CQRS.Queries.Users;


public class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, PaginatedResult<UserDto>>
{
    private readonly IUserService _service;
    private readonly IPaginationService<UserDto> _paginationService;
    private readonly IMapper _mapper;

    public GetAllUsersQueryHandler(IUserService service, IPaginationService<UserDto> paginationService, IMapper mapper)
    {
        _service = service;
        _paginationService = paginationService;
        _mapper = mapper;
    }

    public async Task<PaginatedResult<UserDto>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await _service.GetAllWithRolesAsync();
        return await _paginationService.PaginateAsync(users, request.Page, request.PageSize);
    }
}
