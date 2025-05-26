using TKDHubAPI.Application.DTOs.Tul;

namespace TKDHubAPI.Application.Mappings;
public class TulMappingProfile : Profile
{
    public TulMappingProfile()
    {
        CreateMap<Tul, TulDto>()
            .ForMember(dest => dest.VideoUrl, opt => opt.MapFrom(src => src.VideoUrl != null ? src.VideoUrl.ToString() : null))
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.ImageUrl != null ? src.ImageUrl.ToString() : null));
        CreateMap<TulDto, Tul>()
            .ForMember(dest => dest.VideoUrl, opt => opt.MapFrom(src => string.IsNullOrEmpty(src.VideoUrl) ? null : new Uri(src.VideoUrl)))
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => string.IsNullOrEmpty(src.ImageUrl) ? null : new Uri(src.ImageUrl)));
    }
}

