using Microsoft.AspNetCore.SignalR;
using TKDHubAPI.WebAPI.Controllers;
using TKDHubAPI.WebAPI.SignalR;

public class MercadoLibreWebhookController : BaseApiController
{
    private readonly IHubContext<PaymentHub> _hubContext;

    public MercadoLibreWebhookController(
        ILogger<MercadoLibreWebhookController> logger,
        IHubContext<PaymentHub> hubContext)
        : base(logger)
    {
        _hubContext = hubContext;
    }

    [HttpPost]
    public async Task<IActionResult> Receive([FromBody] MercadoLibreWebhookDto payload)
    {
        await _hubContext.Clients.All.SendAsync("PaymentReceived", payload.Data.Id);
        return Ok();
    }
}
