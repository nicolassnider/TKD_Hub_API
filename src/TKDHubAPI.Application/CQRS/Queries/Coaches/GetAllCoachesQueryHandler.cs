using MediatR;
using TKDHubAPI.Application.DTOs.Pagination;


namespace TKDHubAPI.Application.CQRS.Queries.Coaches;


public class GetAllCoachesQueryHandler : IRequestHandler<GetAllCoachesQuery, PaginatedResult<UserDto>>
{
    private readonly ICoachService _service;
    private readonly IMapper _mapper;


    public GetAllCoachesQueryHandler(ICoachService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }


    public async Task<PaginatedResult<UserDto>> Handle(GetAllCoachesQuery request, CancellationToken cancellationToken)
    {
        return await _service.GetAllAsync(request.Page, request.PageSize);
    }
}
