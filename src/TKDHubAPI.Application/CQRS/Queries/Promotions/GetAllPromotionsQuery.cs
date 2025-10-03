using MediatR;
using TKDHubAPI.Application.DTOs.Pagination;
using TKDHubAPI.Application.DTOs.Promotion;


namespace TKDHubAPI.Application.CQRS.Queries.Promotions;


public class GetAllPromotionsQuery : IRequest<PaginatedResult<PromotionDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 0;
   
    public GetAllPromotionsQuery(int page = 1, int pageSize = 0)
    {
        Page = page;
        PageSize = pageSize;
    }
}
