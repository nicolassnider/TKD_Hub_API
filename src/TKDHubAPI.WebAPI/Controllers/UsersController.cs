using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TKDHubAPI.Infrastructure.Data;

namespace TKDHubAPI.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly TkdHubDbContext _context;

    public UsersController(TkdHubDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users.ToListAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    // Add POST, PUT, DELETE as needed
}
