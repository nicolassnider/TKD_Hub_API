using TKDHubAPI.Application.DTOs.Promotion;

namespace TKDHubAPI.Application.Mappings;
public class PromotionMappingProfile : Profile
{
    public PromotionMappingProfile()
    {
        CreateMap<CreatePromotionDto, Promotion>();
        CreateMap<UpdatePromotionDto, Promotion>();
        CreateMap<Promotion, PromotionDto>();
    }
}
