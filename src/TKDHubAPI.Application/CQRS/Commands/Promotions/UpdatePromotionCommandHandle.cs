using AutoMapper;
using MediatR;
using TKDHubAPI.Application.DTOs.Promotion;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Domain.Entities;


namespace TKDHubAPI.Application.CQRS.Commands.Promotions;


public class UpdatePromotionCommandHandler : IRequestHandler<UpdatePromotionCommand, PromotionDto>
{
    private readonly IPromotionService _promotionService;
    private readonly IMapper _mapper;


    public UpdatePromotionCommandHandler(IPromotionService promotionService, IMapper mapper)
    {
        _promotionService = promotionService;
        _mapper = mapper;
    }


    public async Task<PromotionDto> Handle(UpdatePromotionCommand request, CancellationToken cancellationToken)
    {
        var promotionEntity = _mapper.Map<UpdatePromotionDto, Promotion>(request.UpdatePromotionDto);
        promotionEntity.Id = request.Id;
        await _promotionService.UpdateAsync(promotionEntity);
        return _mapper.Map<PromotionDto>(promotionEntity);
    }
}
