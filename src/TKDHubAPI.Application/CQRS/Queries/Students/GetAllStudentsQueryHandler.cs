using AutoMapper;
using MediatR;
using TKDHubAPI.Application.DTOs.Pagination;
using TKDHubAPI.Application.DTOs.User;
using TKDHubAPI.Application.Interfaces;

namespace TKDHubAPI.Application.CQRS.Queries.Students;

public class GetAllStudentsQueryHandler : IRequestHandler<GetAllStudentsQuery, PaginatedResult<UserDto>>
{
    private readonly IStudentService _service;
    private readonly IPaginationService<UserDto> _paginationService;
    private readonly IMapper _mapper;

    public GetAllStudentsQueryHandler(IStudentService service, IPaginationService<UserDto> paginationService, IMapper mapper)
    {
        _service = service;
        _paginationService = paginationService;
        _mapper = mapper;
    }

    public async Task<PaginatedResult<UserDto>> Handle(GetAllStudentsQuery request, CancellationToken cancellationToken)
    {
        var students = await _service.GetAllStudentsAsync();
        // TODO: Implement excludeClassId filtering logic in the service
        return await _paginationService.PaginateAsync(students, request.Page, request.PageSize);
    }
}
