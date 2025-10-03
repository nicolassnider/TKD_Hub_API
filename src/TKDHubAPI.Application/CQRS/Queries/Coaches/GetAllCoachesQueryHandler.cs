using AutoMapper;
using MediatR;
using TKDHubAPI.Application.DTOs.Pagination;
using TKDHubAPI.Application.DTOs.User;
using TKDHubAPI.Application.Interfaces;

namespace TKDHubAPI.Application.CQRS.Queries.Coaches;

public class GetAllCoachesQueryHandler : IRequestHandler<GetAllCoachesQuery, PaginatedResult<UserDto>>
{
    private readonly ICoachService _service;
    private readonly IPaginationService<UserDto> _paginationService;
    private readonly IMapper _mapper;

    public GetAllCoachesQueryHandler(ICoachService service, IPaginationService<UserDto> paginationService, IMapper mapper)
    {
        _service = service;
        _paginationService = paginationService;
        _mapper = mapper;
    }

    public async Task<PaginatedResult<UserDto>> Handle(GetAllCoachesQuery request, CancellationToken cancellationToken)
    {
        var coaches = await _service.GetAllCoachesAsync();
        return await _paginationService.PaginateAsync(coaches, request.Page, request.PageSize);
    }
}
