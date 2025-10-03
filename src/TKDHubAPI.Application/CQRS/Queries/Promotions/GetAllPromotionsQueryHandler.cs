using AutoMapper;
using MediatR;
using TKDHubAPI.Application.DTOs.Pagination;
using TKDHubAPI.Application.DTOs.Promotion;
using TKDHubAPI.Application.Interfaces;


namespace TKDHubAPI.Application.CQRS.Queries.Promotions;


public class GetAllPromotionsQueryHandler : IRequestHandler<GetAllPromotionsQuery, PaginatedResult<PromotionDto>>
{
    private readonly IPromotionService _service;
    private readonly IPaginationService<PromotionDto> _paginationService;
    private readonly IMapper _mapper;

    public GetAllPromotionsQueryHandler(IPromotionService service, IPaginationService<PromotionDto> paginationService, IMapper mapper)
    {
        _service = service;
        _paginationService = paginationService;
        _mapper = mapper;
    }

    public async Task<PaginatedResult<PromotionDto>> Handle(GetAllPromotionsQuery request, CancellationToken cancellationToken)
    {
        var promotions = await _service.GetAllAsync();
        var promotionDtos = _mapper.Map<IEnumerable<PromotionDto>>(promotions);
        return await _paginationService.PaginateAsync(promotionDtos, request.Page, request.PageSize);
    }
}
