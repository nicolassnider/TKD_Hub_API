namespace TKDHubAPI.Application.Mappings;
public class UserMappingProfile : Profile
{
    public UserMappingProfile()
    {
        CreateMap<CreateUserDto, User>()
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());

        CreateMap<User, UserDto>()
            .ForMember(dest => dest.ManagedDojaangIds,
            opt => opt.MapFrom(src => src.UserDojaangs.Select(ud => ud.DojaangId).ToList()))
            .ForMember(dest => dest.Roles,
            opt => opt.MapFrom(src => src.UserUserRoles
            .Where(uur => uur.UserRole != null && !string.IsNullOrEmpty(uur.UserRole.Name))
            .Select(uur => uur.UserRole.Name)
            .ToList()
        ));

        CreateMap<UpdateUserDto, User>()
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForMember(dest => dest.DojaangId, opt => opt.MapFrom(src => (src.DojaangId == null || src.DojaangId == 0) ? null : src.DojaangId));

        CreateMap<CreateStudentDto, User>()
            .ForMember(dest => dest.CurrentRankId, opt => opt.MapFrom(src => src.RankId));

        CreateMap<UpsertCoachDto, User>()
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForMember(dest => dest.DojaangId, opt => opt.MapFrom(src => (src.DojaangId == null || src.DojaangId == 0) ? null : src.DojaangId))
            .ForMember(dest => dest.CurrentRankId, opt => opt.MapFrom(src => src.RankId));

        // Add mapping for UpdateStudentDto -> User
        CreateMap<UpdateStudentDto, User>()
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForMember(dest => dest.DojaangId, opt => opt.MapFrom(src => (src.DojaangId == null || src.DojaangId == 0) ? null : src.DojaangId))
            .ForMember(dest => dest.CurrentRankId, opt => opt.MapFrom(src => src.RankId));
    }
}
