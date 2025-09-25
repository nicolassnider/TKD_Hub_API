using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Domain.Entities;
using TKDHubFunctions.Helpers;

namespace TKDHubFunctions.Functions;

public class RanksFunction
{
    private readonly ILogger<RanksFunction> _logger;
    private readonly IRankService _rankService;

    public RanksFunction(ILogger<RanksFunction> logger, IRankService rankService)
    {
        _logger = logger;
        _rankService = rankService;
    }

    [Function("GetAllRanks")]
    public async Task<HttpResponseData> GetAllRanks(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Ranks")] HttpRequestData req)
    {
        try
        {
            _logger.LogInformation("Getting all ranks");

            var ranks = await _rankService.GetAllAsync();
            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(ranks);

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all ranks");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Failed to get ranks" });
            return errorResponse;
        }
    }

    [Function("RanksOptions")]
    public HttpResponseData RanksOptions(
        [HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = "Ranks/{*route}")] HttpRequestData req)
    {
        return CorsHelper.CreateCorsResponse(req);
    }
}
