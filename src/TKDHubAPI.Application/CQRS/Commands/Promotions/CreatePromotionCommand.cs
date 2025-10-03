using MediatR;
using TKDHubAPI.Application.DTOs.Promotion;


namespace TKDHubAPI.Application.CQRS.Commands.Promotions;


public class CreatePromotionCommand : IRequest<PromotionDto>
{
    public CreatePromotionDto CreatePromotionDto { get; set; } = null!;
}
