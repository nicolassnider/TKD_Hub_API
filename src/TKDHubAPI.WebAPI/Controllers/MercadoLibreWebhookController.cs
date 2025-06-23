using TKDHubAPI.WebAPI.Controllers;

public class MercadoLibreWebhookController : BaseApiController
{
    private readonly IServiceBusService _serviceBusService;

    public MercadoLibreWebhookController(
        IServiceBusService serviceBusService,
        ILogger<MercadoLibreWebhookController> logger)
        : base(logger)
    {
        _serviceBusService = serviceBusService;
    }

    [HttpPost]
    public async Task<IActionResult> Receive([FromBody] object payload)
    {
        await _serviceBusService.SendPaymentMessageAsync(payload.ToString());
        return Ok();
    }
}
