using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using TKDHubAPI.Application.Interfaces;
using TKDHubFunctions.Helpers;

namespace TKDHubFunctions.Functions;

public class PromotionsFunction
{
    private readonly ILogger<PromotionsFunction> _logger;
    private readonly IPromotionService _promotionService;

    public PromotionsFunction(ILogger<PromotionsFunction> logger, IPromotionService promotionService)
    {
        _logger = logger;
        _promotionService = promotionService;
    }

    [Function("GetAllPromotions")]
    public async Task<HttpResponseData> GetAllPromotions(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Promotions")] HttpRequestData req)
    {
        try
        {
            _logger.LogInformation("Getting all promotions");

            var promotions = await _promotionService.GetAllAsync();
            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(promotions);

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all promotions");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Failed to get promotions" });
            return errorResponse;
        }
    }

    [Function("CreatePromotion")]
    public async Task<HttpResponseData> CreatePromotion(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "Promotions")] HttpRequestData req)
    {
        try
        {
            _logger.LogInformation("Creating new promotion");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var promotion = System.Text.Json.JsonSerializer.Deserialize<TKDHubAPI.Domain.Entities.Promotion>(requestBody);

            if (promotion == null)
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(new { message = "Invalid promotion data" });
                return badRequestResponse;
            }

            await _promotionService.AddAsync(promotion);
            var response = req.CreateResponse(HttpStatusCode.Created);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(promotion);

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating promotion");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Failed to create promotion" });
            return errorResponse;
        }
    }

    [Function("PromotionsOptions")]
    public HttpResponseData PromotionsOptions(
        [HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = "Promotions/{*route}")] HttpRequestData req)
    {
        return CorsHelper.CreateCorsResponse(req);
    }
}
