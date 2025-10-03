using TKDHubAPI.Application.DTOs.BlogPost;
using TKDHubAPI.Application.DTOs.Pagination;

namespace TKDHubAPI.WebAPI.Controllers
{
    /// <summary>
    /// API controller for managing blog posts.
    /// Provides endpoints for creating, retrieving, updating, and deleting blog posts.
    /// </summary>
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
        /// Gets all blog posts with optional pagination and filtering.
        /// </summary>
        /// <param name="page">The page number (1-based).</param>
        /// <param name="pageSize">The number of items per page (0 = no pagination).</param>
        /// <param name="searchTerm">Optional search term to filter blog posts.</param>
        /// <param name="isPublished">Optional filter by publication status.</param>
        /// <param name="authorId">Optional filter by author ID.</param>
        /// <param name="sortBy">Optional field to sort by.</param>
        /// <param name="sortDirection">Sort direction (Ascending or Descending).</param>
        /// <returns>A paginated list of blog posts.</returns>
        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType(typeof(PaginatedResult<BlogPostDto>), 200)]
        public async Task<IActionResult> GetAll(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 0,
            [FromQuery] string? searchTerm = null,
            [FromQuery] bool? isPublished = null,
            [FromQuery] int? authorId = null,
            [FromQuery] string? sortBy = null,
            [FromQuery] string sortDirection = "Ascending"
        )
        {
            // For now, use the existing service method
            // Enhanced pagination and filtering can be implemented in the service layer
            var result = await _blogPostService.GetAllAsync();
            
            // Apply basic filtering if parameters are provided
            var filteredResult = result.AsQueryable();
            
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                filteredResult = filteredResult.Where(x => x.Title.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                                                          x.Content.Contains(searchTerm, StringComparison.OrdinalIgnoreCase));
            }
            
            if (isPublished.HasValue)
            {
                filteredResult = filteredResult.Where(x => x.IsActive == isPublished.Value);
            }
            
            if (authorId.HasValue)
            {
                filteredResult = filteredResult.Where(x => x.AuthorId == authorId.Value);
            }
            
            // Apply sorting
            if (!string.IsNullOrWhiteSpace(sortBy))
            {
                var isDescending = sortDirection.Equals("Descending", StringComparison.OrdinalIgnoreCase);
                filteredResult = sortBy.ToLower() switch
                {
                    "title" => isDescending ? filteredResult.OrderByDescending(x => x.Title) : filteredResult.OrderBy(x => x.Title),
                    "id" => isDescending ? filteredResult.OrderByDescending(x => x.Id) : filteredResult.OrderBy(x => x.Id),
                    "authorname" => isDescending ? filteredResult.OrderByDescending(x => x.AuthorName) : filteredResult.OrderBy(x => x.AuthorName),
                    _ => filteredResult.OrderByDescending(x => x.Id)
                };
            }
            else
            {
                filteredResult = filteredResult.OrderByDescending(x => x.Id);
            }
            
            var finalResult = filteredResult.ToList();
            
            // Apply pagination if requested
            if (pageSize > 0)
            {
                var totalCount = finalResult.Count;
                var skip = (page - 1) * pageSize;
                var paginatedItems = finalResult.Skip(skip).Take(pageSize).ToList();
                
                var paginatedResult = new PaginatedResult<BlogPostDto>
                {
                    Items = paginatedItems,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize
                };
                
                return OkWithPagination(paginatedResult);
            }
            
            // Return all items without pagination
            var nonPaginatedResult = new PaginatedResult<BlogPostDto>
            {
                Items = finalResult,
                TotalCount = finalResult.Count,
                Page = 1,
                PageSize = finalResult.Count
            };
            
            return OkWithPagination(nonPaginatedResult);
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
