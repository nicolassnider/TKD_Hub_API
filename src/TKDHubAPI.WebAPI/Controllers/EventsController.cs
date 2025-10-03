using MediatR;
using TKDHubAPI.Application.CQRS.Commands.Events;
using TKDHubAPI.Application.CQRS.Queries.Events;
using TKDHubAPI.Application.DTOs.Event;
using TKDHubAPI.Domain.Enums;


namespace TKDHubAPI.WebAPI.Controllers;


/// <summary>
/// API controller for managing events.
/// </summary>
public class EventsController : BaseApiController
{
    private readonly IEventService _eventService;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMediator _mediator;


    public EventsController(
        ILogger<EventsController> logger,
        IEventService eventService,
        IMapper mapper,
        ICurrentUserService currentUserService,
        IMediator mediator
    )
        : base(logger)
    {
        _eventService = eventService;
        _mapper = mapper;
        _currentUserService = currentUserService;
        _mediator = mediator;
    }


    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(List<EventDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var query = new GetAllEventsQuery();
        var events = await _mediator.Send(query);
        return SuccessResponse(events);
    }


    [HttpGet("{id}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(EventDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var query = new GetEventByIdQuery { Id = id };
        var eventDto = await _mediator.Send(query);
        if (eventDto == null)
            return ErrorResponse("Event not found.", 404);
        return SuccessResponse(eventDto);
    }


    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(EventDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateEventDto dto)
    {
        try
        {
            var currentUser = await _currentUserService.GetCurrentUserAsync();
            var command = new CreateEventCommand { CreateEventDto = dto, CurrentUser = currentUser! };
            var result = await _mediator.Send(command);
            return SuccessResponse(result);
        }
        catch (InvalidOperationException ex)
        {
            CustomErrorResponseMiddleware.SetErrorMessage(HttpContext, ex.Message);
            return StatusCode(400);
        }
        catch (UnauthorizedAccessException ex)
        {
            return ErrorResponse(ex.Message, 403);
        }
    }


    [HttpPut("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateEventDto dto)
    {
        if (id != dto.Id)
            return ErrorResponse("ID mismatch.", 400);


        try
        {
            var currentUser = await _currentUserService.GetCurrentUserAsync();
            var command = new UpdateEventCommand { Id = id, UpdateEventDto = dto, CurrentUser = currentUser! };
            var result = await _mediator.Send(command);
            return SuccessResponse(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return ErrorResponse(ex.Message, 403);
        }
    }


    [HttpDelete("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var currentUser = await _currentUserService.GetCurrentUserAsync();
            await _eventService.DeleteAsync(id, currentUser!);
            return SuccessResponse("Event deleted successfully.");
        }
        catch (UnauthorizedAccessException ex)
        {
            return ErrorResponse(ex.Message, 403);
        }
    }


    // Filtering endpoints
    [HttpGet("dojaang/{dojaangId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetByDojaang(int dojaangId)
    {
        var items = await _eventService.GetEventsByDojaangIdAsync(dojaangId);
        var dtos = _mapper.Map<List<EventDto>>(items);
        return SuccessResponse(dtos);
    }


    [HttpGet("coach/{coachId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetByCoach(int coachId)
    {
        var items = await _eventService.GetEventsByCoachIdAsync(coachId);
        var dtos = _mapper.Map<List<EventDto>>(items);
        return SuccessResponse(dtos);
    }


    [HttpGet("by-type/{type}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetByType(EventType type)
    {
        var items = await _eventService.GetEventsByTypeAsync(type);
        var dtos = _mapper.Map<List<EventDto>>(items);
        return SuccessResponse(dtos);
    }


    [HttpGet("by-date-range")]
    [AllowAnonymous]
    public async Task<IActionResult> GetByDateRange(
        [FromQuery] DateTime start,
        [FromQuery] DateTime end
    )
    {
        var items = await _eventService.GetEventsByDateRangeAsync(start, end);
        var dtos = _mapper.Map<List<EventDto>>(items);
        return SuccessResponse(dtos);
    }


    // Attendance endpoints
    [HttpGet("{eventId}/attendance")]
    [Authorize]
    public async Task<IActionResult> GetAttendanceForEvent(int eventId)
    {
        var res = await _eventService.GetByIdResultAsync(eventId);
        if (!res.IsSuccess)
            return ErrorResponse(res.Error ?? "Event not found.", 404);
        var dto = _mapper.Map<EventDto>(res.Value!);
        return SuccessResponse(dto);
    }
}
