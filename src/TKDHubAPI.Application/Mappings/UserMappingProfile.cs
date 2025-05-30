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
    }
}
