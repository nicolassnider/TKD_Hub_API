using AutoMapper;
using MediatR;
using TKDHubAPI.Application.DTOs.Pagination;
using TKDHubAPI.Application.DTOs.Promotion;
using TKDHubAPI.Application.Interfaces;


namespace TKDHubAPI.Application.CQRS.Queries.Promotions;


public class GetAllPromotionsQueryHandler : IRequestHandler<GetAllPromotionsQuery, PaginatedResult<PromotionDto>>
{
    private readonly IPromotionService _service;
    private readonly IMapper _mapper;


    public GetAllPromotionsQueryHandler(IPromotionService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }


    public async Task<PaginatedResult<PromotionDto>> Handle(GetAllPromotionsQuery request, CancellationToken cancellationToken)
    {
        return await _service.GetAllAsync(request.Page, request.PageSize);
    }
}
