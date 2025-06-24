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
        Logger.LogInformation("Enviando señal PaymentReceived con ID: {PaymentId}", payload.Data.Id);
        await _hubContext.Clients.All.SendAsync("PaymentReceived", payload.Data.Id);
        Logger.LogInformation("Señal PaymentReceived enviada.");
        return Ok();
    }
}
