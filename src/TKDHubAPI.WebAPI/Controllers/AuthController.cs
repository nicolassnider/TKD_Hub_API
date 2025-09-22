using TKDHubAPI.Application.DTOs.User;

namespace TKDHubAPI.WebAPI.Controllers;

/// <summary>
/// API controller for authentication operations such as user login.
/// </summary>
public partial class AuthController : BaseApiController
{
    private readonly IUserService _userService;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="AuthController"/> class.
    /// </summary>
    /// <param name="userService">The user service instance.</param>
    /// <param name="mapper">The AutoMapper instance.</param>
    /// <param name="logger">The logger instance.</param>
    public AuthController(IUserService userService, IMapper mapper, ILogger<AuthController> logger)
        : base(logger)
    {
        _userService = userService;
        _mapper = mapper;
    }

    /// <summary>
    /// Authenticates a user and returns a JWT token and user information if successful.
    /// </summary>
    /// <param name="loginDto">The login credentials.</param>
    /// <returns>
    /// 200 OK with token and user info if successful; 401 Unauthorized if credentials are invalid.
    /// </returns>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        var (token, user) = await _userService.LoginAndGetTokenAsync(loginDto);
        if (token == null)
        {
            CustomErrorResponseMiddleware.SetErrorMessage(HttpContext, "Invalid credentials.");
            return Unauthorized();
        }

        return Ok(new { token, user });
    }

    /// <summary>
    /// Registers a new user account. This is for public user self-registration.
    /// </summary>
    /// <param name="registerDto">The registration data.</param>
    /// <returns>
    /// 200 OK with success message if registration is successful; 400 Bad Request if registration fails.
    /// </returns>
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        try
        {
            // Map RegisterDto to CreateUserDto
            var createUserDto = _mapper.Map<CreateUserDto>(registerDto);

            // Set default values for public registration - Student role ID 3
            createUserDto.RoleIds = new List<int> { 3 };
            // DojaangId will remain null - students can be assigned to a Dojaang later by admin

            var user = await _userService.RegisterAsync(createUserDto, registerDto.Password);
            if (user == null)
            {
                return ErrorResponse("Registration failed. User may already exist.", 400);
            }

            return SuccessResponse("User registered successfully. You can now log in.");
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Error during user registration");
            return ErrorResponse("An error occurred during registration.", 500);
        }
    }
}
