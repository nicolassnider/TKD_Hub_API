using TKDHubAPI.Application.DTOs.Dojaang;

namespace TKDHubAPI.Application.Mappings;
public class DojaangMappingProfile : Profile
{
    public DojaangMappingProfile()
    {
        CreateMap<CreateDojaangDto, Dojaang>()
            .ForMember(dest => dest.CoachId, opt => opt.MapFrom(src => src.CoachId))
            .ForMember(dest => dest.Location, opt => opt.MapFrom(src => src.Location));


        CreateMap<UpdateDojaangDto, Dojaang>()
            .ForMember(dest => dest.CoachId, opt => opt.MapFrom(src => src.CoachId))
            .ForMember(dest => dest.Location, opt => opt.MapFrom(src => src.Location));


        CreateMap<Dojaang, DojaangDto>()
            .ForMember(dest => dest.CoachName,
                opt => opt.MapFrom(src =>
                    src.Coach != null
                        ? $"{src.Coach.FirstName} {src.Coach.LastName}"
                        : string.Empty
                )
            );
    }
}
