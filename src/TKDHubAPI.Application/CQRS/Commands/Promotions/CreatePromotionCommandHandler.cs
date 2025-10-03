using AutoMapper;
using MediatR;
using TKDHubAPI.Application.DTOs.Promotion;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Domain.Entities;


namespace TKDHubAPI.Application.CQRS.Commands.Promotions;


public class CreatePromotionCommandHandler : IRequestHandler<CreatePromotionCommand, PromotionDto>
{
    private readonly IPromotionService _promotionService;
    private readonly IMapper _mapper;


    public CreatePromotionCommandHandler(IPromotionService promotionService, IMapper mapper)
    {
        _promotionService = promotionService;
        _mapper = mapper;
    }


    public async Task<PromotionDto> Handle(CreatePromotionCommand request, CancellationToken cancellationToken)
    {
                var promotionEntity = _mapper.Map<CreatePromotionDto, Promotion>(request.CreatePromotionDto);
        await _promotionService.AddAsync(promotionEntity);
        var createdPromotion = promotionEntity;
        return _mapper.Map<PromotionDto>(createdPromotion);
    }
}
