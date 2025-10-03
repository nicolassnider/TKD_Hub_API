using MediatR;
using TKDHubAPI.Application.CQRS.Commands.Dojaangs;
using TKDHubAPI.Application.CQRS.Queries.Dojaangs;
using TKDHubAPI.Application.DTOs.Dojaang;


namespace TKDHubAPI.WebAPI.Controllers;


/// <summary>
/// API controller for managing dojaangs (martial arts schools).
/// Provides endpoints to create, retrieve, update, and delete dojaangs.
/// </summary>
[Authorize]
public class DojaangsController : BaseApiController
{
    private readonly IDojaangService _dojaangService;
    private readonly IUserService _userService;
    private readonly IMediator _mediator;


    /// <summary>
    /// Initializes a new instance of the <see cref="DojaangsController"/> class.
    /// </summary>
    /// <param name="dojaangService">The dojaang service instance.</param>
    /// <param name="userService">The user service instance.</param>
    /// <param name="logger">The logger instance.</param>
    /// <param name="mapper">The AutoMapper instance.</param>
    /// <param name="mediator">The MediatR instance.</param>
    public DojaangsController(
        IDojaangService dojaangService,
        IUserService userService,
        ILogger<DojaangsController> logger,
        IMapper mapper,
        IMediator mediator
    )
        : base(logger)
    {
        _dojaangService = dojaangService;
        _userService = userService;
        _mediator = mediator;
    }


    /// <summary>
    /// Retrieves all dojaangs (martial arts schools).
    /// </summary>
    /// <remarks>
    /// Returns a list of all registered dojaangs. This endpoint is available to authenticated users.
    /// Use query or paging on the service layer if you expect many records.
    /// </remarks>
    /// <response code="200">Returns the list of dojaangs.</response>
    /// <response code="401">Unauthorized - user is not authenticated.</response>
    /// <returns>A list of all dojaangs as <see cref="DojaangDto"/> objects.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<DojaangDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAll()
    {
        var query = new GetAllDojaangsQuery();
        var dojaangs = await _mediator.Send(query);
        return SuccessResponse(dojaangs);
    }


    /// <summary>
    /// Retrieves a dojaang by its unique identifier.
    /// </summary>
    /// <param name="id">The dojaang ID.</param>
    /// <remarks>
    /// Returns the requested dojaang when it exists. If the dojaang cannot be found a 404 response
    /// will be returned. This endpoint requires authentication.
    /// </remarks>
    /// <response code="200">Returns the dojaang.</response>
    /// <response code="401">Unauthorized - user is not authenticated.</response>
    /// <response code="404">Dojaang not found.</response>
    /// <returns>The dojaang as a <see cref="DojaangDto"/>, or 404 if not found.</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(DojaangDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var query = new GetDojaangByIdQuery { Id = id };
        var dojaang = await _mediator.Send(query);
        if (dojaang == null)
        {
            return ErrorResponse("Dojaang not found", 404);
        }
        return SuccessResponse(dojaang);
    }


    /// <summary>
    /// Creates a new dojaang. Only admins are allowed to perform this action.
    /// </summary>
    /// <param name="dto">The dojaang creation DTO.</param>
    /// <remarks>
    /// Sample request:
    /// {
    ///   "name": "Westside Taekwondo",
    ///   "address": "123 Martial Ave",
    ///   "location": "City Center",
    ///   "phoneNumber": "555-0100",
    ///   "email": "info@westside.example.com",
    ///   "coachId": 42
    /// }
    /// </remarks>
    /// <response code="200">Returns the created dojaang.</response>
    /// <response code="400">Bad request - validation or business rule failed.</response>
    /// <response code="401">Unauthorized - user is not authenticated.</response>
    /// <response code="404">User performing the action was not found.</response>
    /// <returns>The created dojaang as a <see cref="DojaangDto"/>.</returns>
    [Authorize(Roles = "Admin")]
    [HttpPost]
    [ProducesResponseType(typeof(DojaangDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Create([FromBody] CreateDojaangDto dto)
    {
        var userIdClaim = User.Claims.FirstOrDefault(c =>
            c.Type == System.Security.Claims.ClaimTypes.NameIdentifier
        );
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            return ErrorResponse("Invalid user context.", 401);


        var currentUser = await _userService.GetByIdAsync(userId);
        if (currentUser == null)
            return ErrorResponse("User not found.", 404);


        var command = new CreateDojaangCommand { CreateDojaangDto = dto, CurrentUser = currentUser };
        var dojaang = await _mediator.Send(command);
        return SuccessResponse(dojaang);
    }


    /// <summary>
    /// Updates an existing dojaang. Only admins are allowed to perform this action.
    /// </summary>
    /// <param name="id">The dojaang ID.</param>
    /// <param name="updateDto">The dojaang update DTO.</param>
    /// <remarks>
    /// Provide the ID both in the URL and in the body. Partial updates should be supported by the service
    /// if needed; otherwise send the full resource representation.
    /// </remarks>
    /// <response code="204">Update successful - no content returned.</response>
    /// <response code="400">Bad request - ID mismatch or validation error.</response>
    /// <response code="401">Unauthorized - user is not authenticated.</response>
    /// <response code="404">Dojaang not found.</response>
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateDojaangDto updateDto)
    {
        if (updateDto.Id != id)
        {
            return ErrorResponse("ID in URL does not match ID in body.", 400);
        }


        var query = new GetDojaangByIdQuery { Id = id };
        var existingDojaang = await _mediator.Send(query);
        if (existingDojaang == null)
        {
            return ErrorResponse("Dojaang not found", 404);
        }


        var command = new UpdateDojaangCommand { UpdateDojaangDto = updateDto };
        await _mediator.Send(command);
        return NoContent();
    }


    /// <summary>
    /// Deletes a dojaang by its unique identifier. Only admins are allowed to perform this action.
    /// </summary>
    /// <param name="id">The dojaang ID.</param>
    /// <remarks>
    /// This will permanently remove the dojaang. Ensure the caller has the proper privileges.
    /// </remarks>
    /// <response code="204">Delete successful.</response>
    /// <response code="401">Unauthorized - user is not authenticated.</response>
    /// <response code="404">Dojaang not found.</response>
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var existingDojaang = await _dojaangService.GetByIdAsync(id);
        if (existingDojaang == null)
        {
            return ErrorResponse("Dojaang not found", 404);
        }


        await _dojaangService.DeleteAsync(id);
        return NoContent();
    }


    /// <summary>
    /// Reactivates a previously deactivated dojaang. Only admins are allowed to perform this action.
    /// </summary>
    /// <param name="dojaangId">The dojaang ID.</param>
    /// <response code="200">Returns the reactivated dojaang.</response>
    /// <response code="401">Unauthorized - user is not authenticated.</response>
    /// <response code="404">Dojaang not found.</response>
    [Authorize(Roles = "Admin")]
    [HttpPost("{dojaangId}/reactivate")]
    [ProducesResponseType(typeof(DojaangDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Reactivate(int dojaangId)
    {
        var existingDojaang = await _dojaangService.GetByIdAsync(dojaangId);
        if (existingDojaang == null)
        {
            return ErrorResponse("Dojaang not found", 404);
        }


        await _dojaangService.ReactivateAsync(dojaangId);


        var updated = await _dojaangService.GetByIdAsync(dojaangId);
        if (updated == null)
        {
            return ErrorResponse("Dojaang not found after reactivation", 404);
        }
        return SuccessResponse(updated);
    }
}
