using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TKDHubAPI.Application.DTOs.User;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Domain.Entities;
using TKDHubAPI.WebAPI.Middlewares;

namespace TKDHubAPI.WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public partial class UsersController : ControllerBase
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
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var requestingUserId))
            return Unauthorized("Invalid user context.");

        var currentUserRoles = User.Claims
            .Where(c => c.Type == ClaimTypes.Role)
            .Select(c => c.Value)
            .ToList();

        // Get new user role names
        var newUserRoleNames = new List<string>();
        foreach (var roleId in createUserDto.RoleIds ?? Enumerable.Empty<int>())
        {
            var roleName = await _userService.GetRoleNameById(roleId);
            if (!string.IsNullOrEmpty(roleName))
                newUserRoleNames.Add(roleName);
        }

        // Students cannot create users
        if (currentUserRoles.Contains("Student") && !currentUserRoles.Contains("Admin") && !currentUserRoles.Contains("Coach"))
        {
            CustomErrorResponseMiddleware.SetErrorMessage(HttpContext, "Students cannot create users.");
            return Forbid();
        }

        // If current user is Coach (but not Admin), can only create Coach/Student for dojaangs they manage
        if (currentUserRoles.Contains("Coach") && !currentUserRoles.Contains("Admin"))
        {
            if (!newUserRoleNames.All(r => r == "Coach" || r == "Student"))
            {
                CustomErrorResponseMiddleware.SetErrorMessage(HttpContext, "Coach can only create Coach or Student users.");
                return Forbid();
            }

            if (createUserDto.DojaangId == null)
                return BadRequest("DojaangId is required when a coach creates a user.");

            var manages = await _userService.CoachManagesDojangAsync(requestingUserId, createUserDto.DojaangId.Value);
            if (!manages)
            {
                CustomErrorResponseMiddleware.SetErrorMessage(HttpContext, "Coach can only create users for dojaangs they manage.");
                return Forbid();
            }
        }

        // Create user
        var user = _mapper.Map<User>(createUserDto);
        await _userService.AddAsync(user);
        var resultDto = _mapper.Map<UserDto>(user);
        return CreatedAtAction(nameof(Get), new { id = user.Id }, resultDto);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(CreateUserDto dto, string password)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var requestingUserId))
            return Unauthorized("Invalid user context.");

        var currentUserRoles = User.Claims
            .Where(c => c.Type == ClaimTypes.Role)
            .Select(c => c.Value)
            .ToList();

        var newUserRoleNames = new List<string>();
        foreach (var roleId in dto.RoleIds ?? Enumerable.Empty<int>())
        {
            var roleName = await _userService.GetRoleNameById(roleId);
            if (!string.IsNullOrEmpty(roleName))
                newUserRoleNames.Add(roleName);
        }

        // Students cannot create users
        if (currentUserRoles.Contains("Student") && !currentUserRoles.Contains("Admin") && !currentUserRoles.Contains("Coach"))
        {
            CustomErrorResponseMiddleware.SetErrorMessage(HttpContext, "Students cannot create users.");
            return Forbid();
        }

        // Only Admin can create Admins or Coaches for any dojaang
        if (newUserRoleNames.Any(r => r == "Admin" || r == "Coach"))
        {
            if (!currentUserRoles.Contains("Admin"))
            {
                CustomErrorResponseMiddleware.SetErrorMessage(HttpContext, "Only an Admin can create Admin or Coach users.");
                return Forbid();
            }
        }

        // If current user is Coach (but not Admin), can only create Coach/Student for dojaangs they manage
        if (currentUserRoles.Contains("Coach") && !currentUserRoles.Contains("Admin"))
        {
            if (!newUserRoleNames.All(r => r == "Coach" || r == "Student"))
            {
                CustomErrorResponseMiddleware.SetErrorMessage(HttpContext, "Coach can only create Coach or Student users.");
                return Forbid();
            }

            if (dto.DojaangId == null)
                return BadRequest("DojaangId is required when a coach creates a user.");

            var manages = await _userService.CoachManagesDojangAsync(requestingUserId, dto.DojaangId.Value);
            if (!manages)
            {
                CustomErrorResponseMiddleware.SetErrorMessage(HttpContext, "Coach can only create users for dojaangs they manage.");
                return Forbid();
            }
        }

        var user = await _userService.RegisterAsync(dto, password);
        if (user == null)
            return BadRequest("User already exists.");

        return Ok(user);
    }
}
