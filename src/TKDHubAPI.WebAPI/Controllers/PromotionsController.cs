using TKDHubAPI.Application.DTOs.Promotion;
using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.WebAPI.Controllers;

/// <summary>
/// API controller for managing promotions.
/// Provides endpoints to create, retrieve, update, and delete promotions, as well as to list promotions by student.
/// </summary>
[Authorize]
public class PromotionsController : BaseApiController
{
    private readonly IPromotionService _promotionService;
    private readonly IUserService _userService;
    private readonly IRankService _rankService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="PromotionsController"/> class.
    /// </summary>
    /// <param name="promotionService">The promotion service instance.</param>
    /// <param name="userService">The user service instance.</param>
    /// <param name="rankService">The rank service instance.</param>
    /// <param name="mapper">The AutoMapper instance.</param>
    /// <param name="logger">The logger instance.</param>
    public PromotionsController(
        IPromotionService promotionService,
        IUserService userService,
        IRankService rankService,
        IMapper mapper,
        ILogger<PromotionsController> logger
    ) : base(logger)
    {
        _promotionService = promotionService;
        _userService = userService;
        _rankService = rankService;
        _mapper = mapper;
    }

    /// <summary>
    /// Creates a new promotion and updates the student's current rank.
    /// </summary>
    /// <param name="createPromotionDto">The promotion creation DTO.</param>
    /// <returns>The created promotion as a <see cref="PromotionDto"/>.</returns>
    [HttpPost]
    [ProducesResponseType(typeof(PromotionDto), 200)]
    public async Task<IActionResult> Post([FromBody] CreatePromotionDto createPromotionDto)
    {
        try
        {
            var promotion = _mapper.Map<Promotion>(createPromotionDto);
            await _promotionService.AddAsync(promotion);
            var resultDto = _mapper.Map<PromotionDto>(promotion);

            // Update the user's current rank
            var user = await _userService.GetByIdAsync(promotion.StudentId);
            if (user != null)
            {
                var rank = await _rankService.GetByIdAsync(promotion.RankId);
                user.CurrentRank = rank;
                await _userService.UpdateAsync(user);
            }

            return SuccessResponse(resultDto);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error creating promotion");
            return ErrorResponse(ex.Message, 500);
        }
    }

    /// <summary>
    /// Gets a promotion by its unique identifier.
    /// </summary>
    /// <param name="id">The promotion ID.</param>
    /// <returns>The promotion as a <see cref="PromotionDto"/>, or 404 if not found.</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(PromotionDto), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetById(int id)
    {
        var promotion = await _promotionService.GetByIdAsync(id);
        if (promotion == null)
            return ErrorResponse("Promotion not found", 404);

        var resultDto = _mapper.Map<PromotionDto>(promotion);
        return SuccessResponse(resultDto);
    }

    /// <summary>
    /// Gets all promotions, optionally filtered by student ID.
    /// </summary>
    /// <param name="studentId">Optional student ID to filter promotions.</param>
    /// <returns>A list of promotions as <see cref="PromotionDto"/> objects.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<PromotionDto>), 200)]
    public async Task<IActionResult> GetAll([FromQuery] int? studentId)
    {
        IEnumerable<PromotionDto> result;
        if (studentId.HasValue)
        {
            var promotions = await _promotionService.GetPromotionsByStudentIdAsync(studentId.Value);
            result = promotions.Select(_mapper.Map<PromotionDto>);
        }
        else
        {
            var promotions = await _promotionService.GetAllAsync();
            result = promotions.Select(_mapper.Map<PromotionDto>);
        }
        return SuccessResponse(result);
    }

    /// <summary>
    /// Updates an existing promotion.
    /// </summary>
    /// <param name="id">The promotion ID.</param>
    /// <param name="updatePromotionDto">The promotion update DTO.</param>
    /// <returns>The updated promotion as a <see cref="PromotionDto"/>, or 404 if not found.</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(PromotionDto), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdatePromotionDto updatePromotionDto)
    {
        if (id != updatePromotionDto.Id)
            return ErrorResponse("ID mismatch.", 400);

        var existing = await _promotionService.GetByIdAsync(id);
        if (existing == null)
            return ErrorResponse("Promotion not found", 404);

        _mapper.Map(updatePromotionDto, existing);
        await _promotionService.UpdateAsync(existing);
        var resultDto = _mapper.Map<PromotionDto>(existing);
        return SuccessResponse(resultDto);
    }

    /// <summary>
    /// Deletes a promotion by its unique identifier.
    /// </summary>
    /// <param name="id">The promotion ID.</param>
    /// <returns>No content if successful, or 404 if not found.</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Delete(int id)
    {
        var existing = await _promotionService.GetByIdAsync(id);
        if (existing == null)
            return ErrorResponse("Promotion not found", 404);

        await _promotionService.DeleteAsync(id);
        return NoContent();
    }
}
