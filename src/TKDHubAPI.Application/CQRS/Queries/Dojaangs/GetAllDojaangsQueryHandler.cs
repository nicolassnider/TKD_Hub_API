using AutoMapper;
using MediatR;
using TKDHubAPI.Application.DTOs.Pagination;
using TKDHubAPI.Application.DTOs.Dojaang;
using TKDHubAPI.Application.Interfaces;


namespace TKDHubAPI.Application.CQRS.Queries.Dojaangs;


public class GetAllDojaangsQueryHandler : IRequestHandler<GetAllDojaangsQuery, PaginatedResult<DojaangDto>>
{
    private readonly IDojaangService _service;
    private readonly IPaginationService<DojaangDto> _paginationService;
    private readonly IMapper _mapper;

    public GetAllDojaangsQueryHandler(IDojaangService service, IPaginationService<DojaangDto> paginationService, IMapper mapper)
    {
        _service = service;
        _paginationService = paginationService;
        _mapper = mapper;
    }

    public async Task<PaginatedResult<DojaangDto>> Handle(GetAllDojaangsQuery request, CancellationToken cancellationToken)
    {
        var dojaangs = await _service.GetAllAsync();
        return await _paginationService.PaginateAsync(dojaangs, request.Page, request.PageSize);
    }
}
