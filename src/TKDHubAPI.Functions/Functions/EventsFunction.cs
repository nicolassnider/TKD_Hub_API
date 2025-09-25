using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using TKDHubAPI.Application.Interfaces;
using TKDHubFunctions.Helpers;

namespace TKDHubFunctions.Functions;

public class EventsFunction
{
    private readonly ILogger<EventsFunction> _logger;
    private readonly IEventService _eventService;

    public EventsFunction(ILogger<EventsFunction> logger, IEventService eventService)
    {
        _logger = logger;
        _eventService = eventService;
    }

    [Function("GetAllEvents")]
    public async Task<HttpResponseData> GetAllEvents(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Events")] HttpRequestData req)
    {
        try
        {
            _logger.LogInformation("Getting all events");

            var events = await _eventService.GetAllAsync();
            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(events);

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all events");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Failed to get events" });
            return errorResponse;
        }
    }

    [Function("EventsOptions")]
    public HttpResponseData EventsOptions(
        [HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = "Events/{*route}")] HttpRequestData req)
    {
        return CorsHelper.CreateCorsResponse(req);
    }
}
