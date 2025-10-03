using MediatR;
using TKDHubAPI.Application.DTOs.Promotion;


namespace TKDHubAPI.Application.CQRS.Commands.Promotions;


public class UpdatePromotionCommand : IRequest<PromotionDto>
{
    public int Id { get; set; }
    public UpdatePromotionDto UpdatePromotionDto { get; set; } = null!;
}
