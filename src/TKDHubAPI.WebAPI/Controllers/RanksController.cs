using Microsoft.AspNetCore.Mvc;
using TKDHubAPI.Application.Interfaces;

namespace TKDHubAPI.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RanksController : ControllerBase
{
    private readonly IRankService _rankService;

    public RanksController(IRankService rankService)
    {
        _rankService = rankService;
    }

    // GET: api/Ranks
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var ranks = await _rankService.GetAllAsync();
        return Ok(ranks);
    }

    // GET: api/Ranks/5
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var rank = await _rankService.GetByIdAsync(id);
        if (rank == null)
            return NotFound();
        return Ok(rank);
    }
}
