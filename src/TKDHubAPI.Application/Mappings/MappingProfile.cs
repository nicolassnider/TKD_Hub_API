using TKDHubAPI.Application.DTOs.Dojaang;
using TKDHubAPI.Application.DTOs.User;

namespace TKDHubAPI.Application.Mappings;
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // User Mappings
        CreateMap<CreateUserDto, User>()
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore()); //  Don't map PasswordHash

        CreateMap<User, UserDto>(); //basic user DTO for gets.

        //Dojaang Mappings
        CreateMap<CreateDojaangDto, Dojaang>();
        CreateMap<UpdateDojaangDto, Dojaang>();
        CreateMap<Dojaang, DojaangDto>();

        // Add other mappings here as needed (e.g., for Dojaang, Rank, etc.)
    }
}
