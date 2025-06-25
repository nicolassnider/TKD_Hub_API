using TKDHubAPI.Application.DTOs.TrainingClass;

namespace TKDHubAPI.Application.Mappings;
public class TrainingClassMappingProfile : Profile
{
    public TrainingClassMappingProfile()
    {
        // Entity to DTO
        CreateMap<TrainingClass, TrainingClassDto>()
            .ForMember(dest => dest.DojaangName, opt => opt.MapFrom(src => src.Dojaang != null ? src.Dojaang.Name : null))
            .ForMember(dest => dest.CoachName, opt => opt.MapFrom(src => src.Coach != null ? $"{src.Coach.FirstName} {src.Coach.LastName}" : null))
            .ForMember(dest => dest.Schedules, opt => opt.MapFrom(src => src.Schedules));

        CreateMap<ClassSchedule, ClassScheduleDto>();

        // StudentClass to StudentClassDto
        CreateMap<StudentClass, StudentClassDto>()
            .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => src.Student != null ? src.Student.FirstName + " " + src.Student.LastName : null));

        // DTO to Entity
        CreateMap<TrainingClassDto, TrainingClass>()
            .ForMember(dest => dest.Dojaang, opt => opt.Ignore())
            .ForMember(dest => dest.Coach, opt => opt.Ignore())
            .ForMember(dest => dest.Schedules, opt => opt.MapFrom(src => src.Schedules));

        CreateMap<ClassScheduleDto, ClassSchedule>()
            .ForMember(dest => dest.TrainingClass, opt => opt.Ignore())
            .ForMember(dest => dest.TrainingClassId, opt => opt.Ignore());

        // Create DTOs to Entity
        CreateMap<CreateTrainingClassDto, TrainingClass>()
            .ForMember(dest => dest.Dojaang, opt => opt.Ignore())
            .ForMember(dest => dest.Coach, opt => opt.Ignore())
            .ForMember(dest => dest.Schedules, opt => opt.MapFrom(src => src.Schedules))
            .ForMember(dest => dest.StudentClasses, opt => opt.Ignore());

        CreateMap<CreateClassScheduleDto, ClassSchedule>()
            .ForMember(dest => dest.TrainingClass, opt => opt.Ignore())
            .ForMember(dest => dest.TrainingClassId, opt => opt.Ignore())
            .ForMember(dest => dest.Id, opt => opt.Ignore());
    }
}
