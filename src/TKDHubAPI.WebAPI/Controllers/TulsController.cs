using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TKDHubAPI.Application.DTOs.Tul;
using TKDHubAPI.Application.Interfaces;

namespace TKDHubAPI.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TulsController : BaseApiController
{
    private readonly ITulService _tulService;
    private readonly IMapper _mapper;

    public TulsController(
        ITulService tulService,
        IMapper mapper,
        ILogger<TulsController> logger
    ) : base(logger)
    {
        _tulService = tulService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var tuls = await _tulService.GetAllAsync();
        var result = tuls.Select(_mapper.Map<TulDto>);
        return SuccessResponse(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var tul = await _tulService.GetByIdAsync(id);
        if (tul == null)
            return ErrorResponse("Tul not found", 404);
        var result = _mapper.Map<TulDto>(tul);
        return SuccessResponse(result);
    }

    // No POST: Tuls cannot be created via API

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] TulDto tulDto)
    {
        if (id != tulDto.Id)
            return ErrorResponse("ID mismatch.", 400);

        var existing = await _tulService.GetByIdAsync(id);
        if (existing == null)
            return ErrorResponse("Tul not found", 404);

        _mapper.Map(tulDto, existing);
        await _tulService.UpdateAsync(existing);
        var result = _mapper.Map<TulDto>(existing);
        return SuccessResponse(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existing = await _tulService.GetByIdAsync(id);
        if (existing == null)
            return ErrorResponse("Tul not found", 404);

        await _tulService.DeleteAsync(id);
        return NoContent();
    }

    [HttpGet("by-rank/{rankId}")]
    public async Task<IActionResult> GetByRank(int rankId)
    {
        var tuls = await _tulService.GetAllAsync();
        var filtered = tuls.Where(t => t.RecommendedRankId == rankId);
        var result = filtered.Select(_mapper.Map<TulDto>);
        return SuccessResponse(result);
    }
}
