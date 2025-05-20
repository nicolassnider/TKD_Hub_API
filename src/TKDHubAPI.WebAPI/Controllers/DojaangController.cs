using Microsoft.AspNetCore.Mvc;
using TKDHubAPI.Application.DTOs.Dojaang;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.WebAPI.Controllers;
[ApiController]
[Route("api/[controller]")]
public class DojaangController : BaseApiController
{
    private readonly IDojaangService _dojaangService;
    private readonly ILogger<DojaangController> _logger;
    private readonly IUserService _userService;

    public DojaangController(IDojaangService dojaangService, IUserService userService, ILogger<DojaangController> logger) : base(logger)
    {
        _dojaangService = dojaangService;
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var dojangs = await _dojaangService.GetAllAsync();
        return Ok(dojangs);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var dojaang = await _dojaangService.GetByIdAsync(id);
        if (dojaang == null)
        {
            return NotFound();
        }
        return Ok(dojaang);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDojaangDto createDto)
    {
        // 1. Validate that the CoachId exists in the Users table.
        var coachExists = await _userService.GetByIdAsync(createDto.CoachId);
        if (coachExists is null)
        {
            return BadRequest($"Coach with Id '{createDto.CoachId}' does not exist.");
        }

        // 2. Map the DTO to a Dojaang entity.
        var dojaang = new Dojaang
        {
            Name = createDto.Name,
            Address = createDto.Address,
            PhoneNumber = createDto.PhoneNumber,
            Email = createDto.Email,
            KoreanName = createDto.KoreanName,
            KoreanNamePhonetic = createDto.KoreanNamePhonetic,
            CoachId = createDto.CoachId
        };

        await _dojaangService.AddAsync(dojaang);
        return CreatedAtAction(nameof(GetById), new { id = dojaang.Id }, dojaang);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateDojaangDto updateDto)
    {
        if (id != updateDto.Id)
        {
            return BadRequest("ID mismatch.");
        }

        // 1.  Get the existing Dojaang from the database.
        var existingDojaang = await _dojaangService.GetByIdAsync(id);
        if (existingDojaang == null)
        {
            return NotFound(); // Or perhaps a 410 Gone
        }


        // 2. Update the properties of the existing Dojaang
        //    with the values from the DTO.
        existingDojaang.Name = updateDto.Name;
        existingDojaang.Address = updateDto.Address;
        existingDojaang.PhoneNumber = updateDto.PhoneNumber;
        existingDojaang.Email = updateDto.Email;
        existingDojaang.KoreanName = updateDto.KoreanName;
        existingDojaang.KoreanNamePhonetic = updateDto.KoreanNamePhonetic;
        existingDojaang.CoachId = updateDto.CoachId;

        await _dojaangService.UpdateAsync(existingDojaang);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _dojaangService.DeleteAsync(id);
        return NoContent();
    }
}