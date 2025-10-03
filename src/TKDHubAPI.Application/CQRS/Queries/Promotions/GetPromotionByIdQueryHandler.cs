using MediatR;
using TKDHubAPI.Application.DTOs.Promotion;


namespace TKDHubAPI.Application.CQRS.Queries.Promotions;


public class GetPromotionByIdQueryHandler : IRequestHandler<GetPromotionByIdQuery, PromotionDto?>
{
    private readonly IPromotionService _promotionService;
    private readonly IMapper _mapper;


    public GetPromotionByIdQueryHandler(IPromotionService promotionService, IMapper mapper)
    {
        _promotionService = promotionService;
        _mapper = mapper;
    }


    public async Task<PromotionDto?> Handle(GetPromotionByIdQuery request, CancellationToken cancellationToken)
    {
        var promotion = await _promotionService.GetByIdAsync(request.Id);
        return promotion != null ? _mapper.Map<PromotionDto>(promotion) : null;
    }
}
