namespace TKDHubAPI.WebAPI.Controllers;

/// <summary>
/// API controller for managing ranks.
/// Provides endpoints to retrieve all ranks or a specific rank by its identifier.
/// </summary>
public class RanksController : BaseApiController
{
    private readonly IRankService _rankService;

    /// <summary>
    /// Initializes a new instance of the <see cref="RanksController"/> class.
    /// </summary>
    /// <param name="rankService">The rank service instance.</param>
    /// <param name="logger">The logger instance.</param>
    public RanksController(IRankService rankService, ILogger<RanksController> logger)
        : base(logger)
    {
        _rankService = rankService;
    }

    /// <summary>
    /// Retrieves all ranks.
    /// </summary>
    /// <returns>A list of all ranks.</returns>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var ranks = await _rankService.GetAllAsync();
        return SuccessResponse(ranks);
    }

    /// <summary>
    /// Retrieves a specific rank by its unique identifier.
    /// </summary>
    /// <param name="id">The rank ID.</param>
    /// <returns>The rank if found; otherwise, 404 Not Found.</returns>
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var rank = await _rankService.GetByIdAsync(id);
        if (rank == null)
            return NotFound();
        return SuccessResponse(rank);
    }
}
