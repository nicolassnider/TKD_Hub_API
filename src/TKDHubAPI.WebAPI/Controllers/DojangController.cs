using Microsoft.AspNetCore.Mvc;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.WebAPI.Controllers;
[ApiController]
[Route("api/[controller]")]
public class DojangController : BaseApiController
{
    private readonly IDojangService _dojangService;

    public DojangController(IDojangService dojangService, ILogger logger) : base(logger)
    {
        _dojangService = dojangService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var dojangs = await _dojangService.GetAllAsync();
        return Ok(dojangs);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var dojang = await _dojangService.GetByIdAsync(id);
        if (dojang == null)
            return NotFound();
        return Ok(dojang);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Dojang dojang)
    {
        await _dojangService.AddAsync(dojang);
        return CreatedAtAction(nameof(GetById), new { id = dojang.Id }, dojang);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Dojang dojang)
    {
        if (id != dojang.Id)
            return BadRequest("ID mismatch.");

        await _dojangService.UpdateAsync(dojang);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _dojangService.DeleteAsync(id);
        return NoContent();
    }
}