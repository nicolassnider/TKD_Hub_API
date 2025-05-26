using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TKDHubAPI.Application.DTOs.Promotion;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.WebAPI.Controllers;

public class PromotionsController : BaseApiController
{
    private readonly IPromotionService _promotionService;
    private readonly IUserService _userService;
    private readonly IRankService _rankService;
    private readonly IMapper _mapper;

    public PromotionsController(
        IPromotionService promotionService,
        IUserService userService, // Add this parameter
        IRankService rankService,
        IMapper mapper,
        ILogger<PromotionsController> logger
    ) : base(logger)
    {
        _promotionService = promotionService;
        _userService = userService; // Assign here
        _rankService = rankService;
        _mapper = mapper;
    }

    /// <summary>
    /// Creates a new promotion.
    /// </summary>
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
    /// Gets a promotion by ID.
    /// </summary>
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
    /// Gets all promotions (optionally filter by studentId).
    /// </summary>
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
    /// Deletes a promotion by ID.
    /// </summary>
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
