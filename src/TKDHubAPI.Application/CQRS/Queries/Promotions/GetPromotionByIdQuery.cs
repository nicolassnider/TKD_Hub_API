using MediatR;
using TKDHubAPI.Application.DTOs.Promotion;


namespace TKDHubAPI.Application.CQRS.Queries.Promotions;


public class GetPromotionByIdQuery : IRequest<PromotionDto?>
{
    public int Id { get; set; }
}
