using TKDHubAPI.Application.DTOs.Promotion;

namespace TKDHubAPI.Application.Mappings;
public class PromotionMappingProfile : Profile
{
    public PromotionMappingProfile()
    {
        CreateMap<CreatePromotionDto, Promotion>();
        CreateMap<UpdatePromotionDto, Promotion>();
        CreateMap<Promotion, PromotionDto>()
            .ForMember(dest => dest.StudentName,
                opt => opt.MapFrom(src => src.Student != null
                    ? $"{src.Student.FirstName} {src.Student.LastName}"
                    : null))
            .ForMember(dest => dest.RankName,
                opt => opt.MapFrom(src => src.Rank != null
                    ? src.Rank.Name
                    : null));
    }
}
