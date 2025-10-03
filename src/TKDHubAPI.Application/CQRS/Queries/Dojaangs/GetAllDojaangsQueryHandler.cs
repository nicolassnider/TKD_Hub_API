using AutoMapper;
using MediatR;
using TKDHubAPI.Application.DTOs.Pagination;
using TKDHubAPI.Application.DTOs.Dojaang;
using TKDHubAPI.Application.Interfaces;


namespace TKDHubAPI.Application.CQRS.Queries.Dojaangs;


public class GetAllDojaangsQueryHandler : IRequestHandler<GetAllDojaangsQuery, PaginatedResult<DojaangDto>>
{
    private readonly IDojaangService _service;
    private readonly IMapper _mapper;


    public GetAllDojaangsQueryHandler(IDojaangService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }


    public async Task<PaginatedResult<DojaangDto>> Handle(GetAllDojaangsQuery request, CancellationToken cancellationToken)
    {
        return await _service.GetAllAsync(request.Page, request.PageSize);
    }
}
