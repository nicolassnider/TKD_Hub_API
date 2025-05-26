using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TKDHubAPI.Application.DTOs.Dojaang;
using TKDHubAPI.Application.Interfaces;

namespace TKDHubAPI.WebAPI.Controllers;
[ApiController]
[Route("api/[controller]")]
public class DojaangController : BaseApiController
{
    private readonly IDojaangService _dojaangService;
    private readonly ILogger<DojaangController> _logger;
    private readonly IUserService _userService;
    private readonly IMapper _mapper;

    public DojaangController(
        IDojaangService dojaangService,
        IUserService userService,
        ILogger<DojaangController> logger,
        IMapper mapper
    ) : base(logger)
    {
        _dojaangService = dojaangService;
        _userService = userService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var dojaangs = await _dojaangService.GetAllAsync();
        var result = dojaangs.Select(_mapper.Map<DojaangDto>);
        return SuccessResponse(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var dojaang = await _dojaangService.GetByIdAsync(id);
        if (dojaang == null)
        {
            return ErrorResponse("Dojaang not found", 404);
        }
        var result = _mapper.Map<DojaangDto>(dojaang);
        return SuccessResponse(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDojaangDto dto)
    {
        // Get the current user (admin) from the JWT claims
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            return ErrorResponse("Invalid user context.", 401);

        var currentUser = await _userService.GetByIdAsync(userId);
        if (currentUser == null)
            return ErrorResponse("User not found.", 404);

        var dojaang = await _dojaangService.CreateDojangAsync(dto, currentUser);
        var result = _mapper.Map<DojaangDto>(dojaang);
        return SuccessResponse(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateDojaangDto updateDto)
    {
        if (id != updateDto.Id)
        {
            return ErrorResponse("ID mismatch.");
        }

        var existingDojaang = await _dojaangService.GetByIdAsync(id);
        if (existingDojaang == null)
        {
            return ErrorResponse("Dojaang not found", 404);
        }

        // Only admins reach this point due to the [Authorize] attribute

        // Use AutoMapper to map the DTO to the existing entity
        _mapper.Map(updateDto, existingDojaang);

        await _dojaangService.UpdateAsync(existingDojaang);
        return NoContent();
    }

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
