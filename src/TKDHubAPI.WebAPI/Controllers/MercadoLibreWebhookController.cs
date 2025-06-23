using Azure.Messaging.ServiceBus;
using TKDHubAPI.WebAPI.Controllers;

public class MercadoLibreWebhookController : BaseApiController
{
    private readonly ServiceBusClient _serviceBusClient;
    private readonly string _queueName = "mercadopago-payments";

    public MercadoLibreWebhookController(
        ServiceBusClient serviceBusClient,
        ILogger<MercadoLibreWebhookController> logger)
        : base(logger)
    {
        _serviceBusClient = serviceBusClient;
    }

    [HttpPost]
    public async Task<IActionResult> Receive([FromBody] object payload)
    {
        var sender = _serviceBusClient.CreateSender(_queueName);
        var message = new ServiceBusMessage(payload.ToString());
        await sender.SendMessageAsync(message);
        return Ok();
    }
}
