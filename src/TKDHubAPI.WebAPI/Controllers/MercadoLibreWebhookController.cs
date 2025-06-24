using TKDHubAPI.Application.DTOs.Payment;
using TKDHubAPI.WebAPI.Controllers;

public class MercadoLibreWebhookController : BaseApiController
{


    public MercadoLibreWebhookController(
        ILogger<MercadoLibreWebhookController> logger)
        : base(logger)
    {

    }

    [HttpPost]
    public async Task<IActionResult> Receive([FromBody] MercadoLibreWebhookDto payload)
    {
        return Ok();
    }
}
