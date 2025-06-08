using TKDHubAPI.Application.DTOs.Dojaang;

namespace TKDHubAPI.WebAPI.Controllers;

/// <summary>
/// API controller for managing dojaangs (martial arts schools).
/// Provides endpoints to create, retrieve, update, and delete dojaangs.
/// </summary>
[Authorize]
public class DojaangController : BaseApiController
{
    private readonly IDojaangService _dojaangService;
    private readonly ILogger<DojaangController> _logger;
    private readonly IUserService _userService;

    /// <summary>
    /// Initializes a new instance of the <see cref="DojaangController"/> class.
    /// </summary>
    /// <param name="dojaangService">The dojaang service instance.</param>
    /// <param name="userService">The user service instance.</param>
    /// <param name="logger">The logger instance.</param>
    /// <param name="mapper">The AutoMapper instance.</param>
    public DojaangController(
        IDojaangService dojaangService,
        IUserService userService,
        ILogger<DojaangController> logger,
        IMapper mapper
    ) : base(logger)
    {
        _dojaangService = dojaangService;
        _userService = userService;
    }


    /// <summary>
    /// Retrieves all dojaangs.
    /// </summary>
    /// <returns>A list of all dojaangs as <see cref="DojaangDto"/> objects.</returns>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var dojaangs = await _dojaangService.GetAllAsync();
        return SuccessResponse(dojaangs);
    }


    /// <summary>
    /// Retrieves a dojaang by its unique identifier.
    /// </summary>
    /// <param name="id">The dojaang ID.</param>
    /// <returns>The dojaang as a <see cref="DojaangDto"/>, or 404 if not found.</returns>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var dojaang = await _dojaangService.GetByIdAsync(id);
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
    /// <returns>The created dojaang as a <see cref="DojaangDto"/>.</returns>
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDojaangDto dto)
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            return ErrorResponse("Invalid user context.", 401);


        var currentUser = await _userService.GetByIdAsync(userId);
        if (currentUser == null)
            return ErrorResponse("User not found.", 404);


        var dojaang = await _dojaangService.CreateDojaangAsync(dto, currentUser);
        return SuccessResponse(dojaang);
    }


    /// <summary>
    /// Updates an existing dojaang. Only admins are allowed to perform this action.
    /// </summary>
    /// <param name="id">The dojaang ID.</param>
    /// <param name="updateDto">The dojaang update DTO.</param>
    /// <returns>No content if successful, or an error response.</returns>
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateDojaangDto updateDto)
    {
        if (updateDto.Id != id)
        {
            return ErrorResponse("ID in URL does not match ID in body.", 400);
        }




        var existingDojaang = await _dojaangService.GetByIdAsync(id);
        if (existingDojaang == null)
        {
            return ErrorResponse("Dojaang not found", 404);
        }


        await _dojaangService.UpdateAsync(updateDto);
        return NoContent();
    }


    /// <summary>
    /// Deletes a dojaang by its unique identifier. Only admins are allowed to perform this action.
    /// </summary>
    /// <param name="id">The dojaang ID.</param>
    /// <returns>No content if successful, or 404 if not found.</returns>
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
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

}
