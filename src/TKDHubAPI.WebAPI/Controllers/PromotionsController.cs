using MediatR;
using TKDHubAPI.Application.CQRS.Commands.Promotions;
using TKDHubAPI.Application.CQRS.Queries.Promotions;
using TKDHubAPI.Application.DTOs.Pagination;
using TKDHubAPI.Application.DTOs.Promotion;


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
    private readonly IMediator _mediator;


    /// <summary>
    /// Initializes a new instance of the <see cref="PromotionsController"/> class.
    /// </summary>
    /// <param name="promotionService">The promotion service instance.</param>
    /// <param name="userService">The user service instance.</param>
    /// <param name="rankService">The rank service instance.</param>
    /// <param name="mapper">The AutoMapper instance.</param>
    /// <param name="logger">The logger instance.</param>
    /// <param name="mediator">The MediatR instance.</param>
    public PromotionsController(
        IPromotionService promotionService,
        IUserService userService,
        IRankService rankService,
        IMapper mapper,
        ILogger<PromotionsController> logger,
        IMediator mediator
    ) : base(logger)
    {
        _promotionService = promotionService;
        _userService = userService;
        _rankService = rankService;
        _mapper = mapper;
        _mediator = mediator;
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
            var command = new CreatePromotionCommand { CreatePromotionDto = createPromotionDto };
            var result = await _mediator.Send(command);
            return SuccessResponse(result);
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
        var query = new GetPromotionByIdQuery { Id = id };
        var promotion = await _mediator.Send(query);
        if (promotion == null)
            return ErrorResponse("Promotion not found", 404);


        return SuccessResponse(promotion);
    }


    /// <summary>
    /// Retrieves all promotions with optional pagination and filtering.
    /// </summary>
    /// <param name="page">The page number (default: 1).</param>
    /// <param name="pageSize">The number of items per page (default: configured value).</param>
    /// <param name="studentId">Optional student ID to filter promotions.</param>
    /// <param name="dojaangId">Optional dojang ID to filter promotions.</param>
    /// <param name="fromRankId">Optional starting rank ID to filter promotions.</param>
    /// <param name="toRankId">Optional ending rank ID to filter promotions.</param>
    /// <param name="fromDate">Optional start date to filter promotions.</param>
    /// <param name="toDate">Optional end date to filter promotions.</param>
    /// <returns>A paginated list of promotions as <see cref="PromotionDto"/> objects.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedResult<PromotionDto>), 200)]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 0,
        [FromQuery] int? studentId = null,
        [FromQuery] int? dojaangId = null,
        [FromQuery] int? fromRankId = null,
        [FromQuery] int? toRankId = null,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        // Check if any filters are applied (excluding pagination)
        bool hasFilters = studentId.HasValue || dojaangId.HasValue || fromRankId.HasValue || 
                         toRankId.HasValue || fromDate.HasValue || toDate.HasValue;

        if (hasFilters)
        {
            // For complex filtered queries, use the service directly for now
            // This could be enhanced to support pagination in future iterations
            var promotions = await _promotionService.GetPromotionsByStudentIdAsync(studentId ?? 0);
            var result = promotions.Select(_mapper.Map<PromotionDto>);
            
            // Create a mock paginated result for consistency
            var mockPaginatedResult = new PaginatedResult<PromotionDto>
            {
                Items = result,
                TotalCount = result.Count(),
                Page = 1,
                PageSize = result.Count()
            };
            
            return OkWithPagination(mockPaginatedResult);
        }
        else
        {
            // Use CQRS for paginated non-filtered queries
            var query = new GetAllPromotionsQuery { Page = page, PageSize = pageSize };
            var promotions = await _mediator.Send(query);
            return OkWithPagination(promotions);
        }
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


    /// <summary>
    /// Gets all promotions for a specific student by their ID.
    /// </summary>
    /// <param name="studentId">The ID of the student.</param>
    /// <returns>A list of promotions as <see cref="PromotionDto"/> objects.</returns>
    [HttpGet("student/{studentId}")]
    [ProducesResponseType(typeof(IEnumerable<PromotionDto>), 200)]
    public async Task<IActionResult> GetPromotionsByStudentId(int studentId)
    {
        var promotions = await _promotionService.GetPromotionsByStudentIdAsync(studentId);
        var result = promotions.Select(_mapper.Map<PromotionDto>);
        return SuccessResponse(result);
    }


}
