using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TKDHubAPI.Application.DTOs.User;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IMapper _mapper;

    public UsersController(IUserService userService, IMapper mapper)
    {
        _userService = userService;
        _mapper = mapper;
    }


    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> Get()
    {
        var users = await _userService.GetAllAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<User>> Get(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

    [HttpPost]
    public async Task<ActionResult<User>> Post([FromBody] CreateUserDto createUserDto)
    {

        var user = _mapper.Map<User>(createUserDto);
        // PasswordHash should be set by the UserService

        // 3. Call the UserService to add the user
        await _userService.AddAsync(user);

        // 4. Return CreatedAtAction
        var resultDto = _mapper.Map<UserDto>(user);
        return CreatedAtAction(nameof(Get), new { id = user.Id }, resultDto);
    }
}