using TKDHubAPI.Application.DTOs.Tul;

namespace TKDHubAPI.WebAPI.Controllers;

/// <summary>
/// API controller for managing Tuls (patterns/forms).
/// Provides endpoints to retrieve, update, and delete Tuls, as well as filter Tuls by rank.
/// </summary>
public class TulsController : BaseApiController
{
    private readonly ITulService _tulService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="TulsController"/> class.
    /// </summary>
    /// <param name="tulService">The Tul service instance.</param>
    /// <param name="mapper">The AutoMapper instance.</param>
    /// <param name="logger">The logger instance.</param>
    public TulsController(
        ITulService tulService,
        IMapper mapper,
        ILogger<TulsController> logger
    ) : base(logger)
    {
        _tulService = tulService;
        _mapper = mapper;
    }

    /// <summary>
    /// Retrieves all Tuls.
    /// </summary>
    /// <returns>A standardized success response with a list of all Tuls.</returns>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var tuls = await _tulService.GetAllAsync();
        var result = tuls.Select(_mapper.Map<TulDto>);
        return SuccessResponse(result);
    }

    /// <summary>
    /// Retrieves a specific Tul by its unique identifier.
    /// </summary>
    /// <param name="id">The Tul ID.</param>
    /// <returns>A standardized success response with the Tul if found; otherwise, an error response.</returns>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var tul = await _tulService.GetByIdAsync(id);
        if (tul == null)
            return ErrorResponse("Tul not found", 404);
        var result = _mapper.Map<TulDto>(tul);
        return SuccessResponse(result);
    }

    /// <summary>
    /// Retrieves all Tuls recommended for a specific rank.
    /// </summary>
    /// <param name="rankId">The rank ID to filter Tuls by.</param>
    /// <returns>A standardized success response with a list of Tuls for the specified rank.</returns>
    [HttpGet("by-rank/{rankId}")]
    public async Task<IActionResult> GetByRank(int rankId)
    {
        var tuls = await _tulService.GetAllAsync();
        var filtered = tuls.Where(t => t.RecommendedRankId == rankId);
        var result = filtered.Select(_mapper.Map<TulDto>);
        return SuccessResponse(result);
    }
}
