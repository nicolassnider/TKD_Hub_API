using TKDHubAPI.Application.DTOs.User;

namespace TKDHubAPI.Application.Mappings;
public class UserMappingProfile : Profile
{
    public UserMappingProfile()
    {
        CreateMap<CreateUserDto, User>()
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());

        CreateMap<User, UserDto>()
            .ForMember(dest => dest.ManagedDojaangIds,
                opt => opt.MapFrom(src => src.UserDojaangs != null
                    ? src.UserDojaangs.Select(ud => ud.DojaangId).ToList()
                    : new List<int>()));

        CreateMap<UpdateUserDto, User>()
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForMember(dest => dest.DojaangId, opt => opt.MapFrom(src => (src.DojaangId == null || src.DojaangId == 0) ? null : src.DojaangId));

        CreateMap<CreateStudentDto, User>()
            .ForMember(dest => dest.CurrentRankId, opt => opt.MapFrom(src => src.RankId));

        CreateMap<UpsertCoachDto, User>()
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForMember(dest => dest.DojaangId, opt => opt.MapFrom(src => (src.DojaangId == null || src.DojaangId == 0) ? null : src.DojaangId))
            .ForMember(dest => dest.CurrentRankId, opt => opt.MapFrom(src => src.RankId));
    }
}

