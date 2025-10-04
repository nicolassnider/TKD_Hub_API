using System.Text.Json;
using TKDHubAPI.Application.DTOs.Dashboard;

namespace TKDHubAPI.Application.Mappings;

public class DashboardMappingProfile : Profile
{
    public DashboardMappingProfile()
    {
        CreateMap<DashboardLayout, DashboardLayoutDto>()
            .ForMember(dest => dest.Widgets, opt => opt.MapFrom(src => src.Widgets))
            .ReverseMap()
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());

        CreateMap<Widget, WidgetDto>()
            .ForMember(dest => dest.Position, opt => opt.MapFrom(src => new WidgetPositionDto
            {
                X = src.X,
                Y = src.Y,
                Width = src.Width,
                Height = src.Height
            }))
            .ForMember(dest => dest.Config, opt => opt.MapFrom<ConfigDeserializeResolver>())
            .ReverseMap()
            .ForMember(dest => dest.X, opt => opt.MapFrom(src => src.Position.X))
            .ForMember(dest => dest.Y, opt => opt.MapFrom(src => src.Position.Y))
            .ForMember(dest => dest.Width, opt => opt.MapFrom(src => src.Position.Width))
            .ForMember(dest => dest.Height, opt => opt.MapFrom(src => src.Position.Height))
            .ForMember(dest => dest.ConfigJson, opt => opt.MapFrom<ConfigSerializeResolver>())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DashboardLayout, opt => opt.Ignore());

        CreateMap<CreateWidgetDto, Widget>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.NewGuid().ToString()))
            .ForMember(dest => dest.DashboardLayoutId, opt => opt.MapFrom(src => src.DashboardId))
            .ForMember(dest => dest.X, opt => opt.MapFrom(src => src.Position.X))
            .ForMember(dest => dest.Y, opt => opt.MapFrom(src => src.Position.Y))
            .ForMember(dest => dest.Width, opt => opt.MapFrom(src => src.Position.Width))
            .ForMember(dest => dest.Height, opt => opt.MapFrom(src => src.Position.Height))
            .ForMember(dest => dest.ConfigJson, opt => opt.MapFrom<ConfigSerializeFromDictionaryResolver>())
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

        CreateMap<CreateDashboardLayoutDto, DashboardLayout>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.NewGuid().ToString()))
            .ForMember(dest => dest.IsDefault, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.Widgets, opt => opt.MapFrom(src => src.Widgets));
    }
}

public class ConfigDeserializeResolver : IValueResolver<Widget, WidgetDto, Dictionary<string, object>>
{
    public Dictionary<string, object> Resolve(Widget source, WidgetDto destination, Dictionary<string, object> destMember, ResolutionContext context)
    {
        if (string.IsNullOrEmpty(source.ConfigJson))
            return new Dictionary<string, object>();

        try
        {
            return JsonSerializer.Deserialize<Dictionary<string, object>>(source.ConfigJson) ?? new Dictionary<string, object>();
        }
        catch
        {
            return new Dictionary<string, object>();
        }
    }
}

public class ConfigSerializeResolver : IValueResolver<WidgetDto, Widget, string>
{
    public string Resolve(WidgetDto source, Widget destination, string destMember, ResolutionContext context)
    {
        try
        {
            return JsonSerializer.Serialize(source.Config);
        }
        catch
        {
            return "{}";
        }
    }
}

public class ConfigSerializeFromDictionaryResolver : IValueResolver<CreateWidgetDto, Widget, string>
{
    public string Resolve(CreateWidgetDto source, Widget destination, string destMember, ResolutionContext context)
    {
        try
        {
            return JsonSerializer.Serialize(source.Config);
        }
        catch
        {
            return "{}";
        }
    }
}
