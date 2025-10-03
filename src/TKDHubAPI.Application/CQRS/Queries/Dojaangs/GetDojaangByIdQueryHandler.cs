using MediatR;


namespace TKDHubAPI.Application.CQRS.Queries.Dojaangs;


public class GetDojaangByIdQueryHandler : IRequestHandler<GetDojaangByIdQuery, DojaangDto?>
{
    private readonly IDojaangService _dojaangService;
    private readonly IMapper _mapper;


    public GetDojaangByIdQueryHandler(IDojaangService dojaangService, IMapper mapper)
    {
        _dojaangService = dojaangService;
        _mapper = mapper;
    }


    public async Task<DojaangDto?> Handle(GetDojaangByIdQuery request, CancellationToken cancellationToken)
    {
        return await _dojaangService.GetByIdAsync(request.Id);
    }
}
