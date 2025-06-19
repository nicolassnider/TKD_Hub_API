using TKDHubAPI.Application.DTOs.BlogPost;

namespace TKDHubAPI.WebAPI.Controllers
{
    /// <summary>
    /// API controller for managing blog posts.
    /// Provides endpoints for creating, retrieving, updating, and deleting blog posts.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class BlogPostsController : BaseApiController
    {
        private readonly IBlogPostService _blogPostService;

        /// <summary>
        /// Initializes a new instance of the <see cref="BlogPostsController"/> class.
        /// </summary>
        /// <param name="blogPostService">The blog post service.</param>
        /// <param name="logger">The logger instance.</param>
        public BlogPostsController(IBlogPostService blogPostService, ILogger<BlogPostsController> logger)
            : base(logger)
        {
            _blogPostService = blogPostService;
        }

        /// <summary>
        /// Creates a new blog post.
        /// </summary>
        /// <param name="dto">The DTO containing the blog post data.</param>
        /// <returns>The created blog post.</returns>
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateBlogPostDto dto)
        {
            var authorId = int.Parse(User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier)!);
            var userRoles = GetCurrentUserRoles();
            var result = await _blogPostService.CreateAsync(dto, authorId, userRoles);
            return SuccessResponse(result);
        }

        /// <summary>
        /// Gets a blog post by its unique identifier.
        /// </summary>
        /// <param name="id">The unique identifier of the blog post.</param>
        /// <returns>The blog post if found; otherwise, a 404 error.</returns>
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _blogPostService.GetByIdAsync(id);
            if (result == null) return ErrorResponse("Blog post not found.", 404);
            return SuccessResponse(result);
        }

        /// <summary>
        /// Gets all blog posts.
        /// </summary>
        /// <returns>A list of all blog posts.</returns>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var result = await _blogPostService.GetAllAsync();
            return SuccessResponse(result);
        }

        /// <summary>
        /// Updates an existing blog post.
        /// </summary>
        /// <param name="id">The unique identifier of the blog post to update.</param>
        /// <param name="dto">The DTO containing the updated blog post data.</param>
        /// <returns>The updated blog post if found; otherwise, a 404 error.</returns>
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] CreateBlogPostDto dto)
        {
            var authorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRoles = GetCurrentUserRoles(); // from BaseApiController
            var result = await _blogPostService.UpdateAsync(id, dto, authorId, userRoles);
            if (result == null) return ErrorResponse("Blog post not found or not authorized.", 404);
            return SuccessResponse(result);
        }

        /// <summary>
        /// Deletes a blog post by its unique identifier.
        /// </summary>
        /// <param name="id">The unique identifier of the blog post to delete.</param>
        /// <returns>A success message if deleted; otherwise, a 404 error.</returns>
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var authorId = int.Parse(User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier)!);
            var userRoles = GetCurrentUserRoles();
            var success = await _blogPostService.DeleteAsync(id, authorId, userRoles);
            if (!success) return ErrorResponse("Blog post not found or not authorized.", 404);
            return SuccessResponse("Blog post deleted successfully.");
        }
    }
}
