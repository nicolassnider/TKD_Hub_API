using TKDHubAPI.Application.DTOs.Payment;

namespace TKDHubAPI.WebAPI.Controllers;

/// <summary>
/// Controller responsible for handling Mercado Pago payment operations, such as creating payment preferences (payment links).
/// </summary>
public class MercadoPagoController : BaseApiController
{
    private readonly IMercadoPagoService _mercadoPagoService;

    /// <summary>
    /// Initializes a new instance of the <see cref="MercadoPagoController"/> class with the specified logger and Mercado Pago service.
    /// </summary>
    /// <param name="logger">The logger instance for logging operations.</param>
    /// <param name="mercadoPagoService">The Mercado Pago service for payment operations.</param>
    public MercadoPagoController(ILogger<MercadoPagoController> logger, IMercadoPagoService mercadoPagoService)
        : base(logger)
    {
        _mercadoPagoService = mercadoPagoService;
    }

    /// <summary>
    /// Creates a Mercado Pago payment preference and returns the payment URL.
    /// </summary>
    /// <param name="request">The request containing the amount, description, and payer email for the payment preference.</param>
    /// <returns>
    /// An <see cref="IActionResult"/> containing the payment URL if successful; otherwise, a bad request response.
    /// </returns>
    [HttpPost("create-preference")]
    public async Task<IActionResult> CreatePreference([FromBody] CreatePreferenceRequest request, CancellationToken cancellationToken)
    {
        if (request == null || request.Amount <= 0 || string.IsNullOrWhiteSpace(request.Description) || string.IsNullOrWhiteSpace(request.PayerEmail))
            return BadRequest("Invalid request.");

        var result = await _mercadoPagoService.CreatePreferenceAsync(request.Amount, request.Description, request.PayerEmail, cancellationToken);

        if (result == null)
            return StatusCode(500, "Unexpected error while creating payment preference.");

        if (!result.Success)
            return BadRequest(new { Error = result.ErrorMessage });

        return Ok(new { PaymentUrl = result.PaymentUrl });
    }
}
