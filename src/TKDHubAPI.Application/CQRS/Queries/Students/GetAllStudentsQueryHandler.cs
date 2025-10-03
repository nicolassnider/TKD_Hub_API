using MediatR;
using TKDHubAPI.Application.DTOs.Pagination;


namespace TKDHubAPI.Application.CQRS.Queries.Students;


public class GetAllStudentsQueryHandler : IRequestHandler<GetAllStudentsQuery, PaginatedResult<UserDto>>
{
    private readonly IStudentService _service;
    private readonly IMapper _mapper;


    public GetAllStudentsQueryHandler(IStudentService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }


    public async Task<PaginatedResult<UserDto>> Handle(GetAllStudentsQuery request, CancellationToken cancellationToken)
    {
        return await _service.GetAllAsync(request.Page, request.PageSize);
    }
}
