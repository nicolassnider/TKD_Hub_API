using TKDHubAPI.Application.DTOs.Event;

namespace TKDHubAPI.Application.Mappings;
public class EventMappingProfile : Profile
{
    public EventMappingProfile()
    {
        CreateMap<CreateEventDto, Event>();
        CreateMap<UpdateEventDto, Event>();
        CreateMap<Event, EventDto>();
    }
}

