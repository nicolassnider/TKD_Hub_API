using TKDHubAPI.Application.DTOs.BlogPost;

namespace TKDHubAPI.Application.Interfaces;

/// <summary>
/// Provides methods for managing blog posts, including creation, retrieval, update, and deletion.
/// Enforces business rules: all roles can create posts, coaches can update/delete their own posts, and admins can perform all operations.
/// </summary>
public interface IBlogPostService
{
    /// <summary>
    /// Creates a new blog post.
    /// </summary>
    /// <param name="dto">The DTO containing the blog post data.</param>
    /// <param name="authorId">The ID of the author creating the post.</param>
    /// <param name="userRoles">The roles of the user creating the post.</param>
    /// <returns>The created BlogPostDto.</returns>
    Task<BlogPostDto> CreateAsync(CreateBlogPostDto dto, int authorId, IEnumerable<string> userRoles);

    /// <summary>
    /// Retrieves a blog post by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the blog post.</param>
    /// <returns>The BlogPostDto if found; otherwise, null.</returns>
    Task<BlogPostDto?> GetByIdAsync(int id);

    /// <summary>
    /// Retrieves all blog posts.
    /// </summary>
    /// <returns>An enumerable collection of BlogPostDto.</returns>
    Task<IEnumerable<BlogPostDto>> GetAllAsync();

    /// <summary>
    /// Updates an existing blog post.
    /// </summary>
    /// <param name="id">The unique identifier of the blog post to update.</param>
    /// <param name="dto">The DTO containing the updated blog post data.</param>
    /// <param name="authorId">The ID of the author performing the update.</param>
    /// <param name="userRoles">The roles of the user performing the update.</param>
    /// <returns>The updated BlogPostDto if found and authorized; otherwise, null.</returns>
    Task<BlogPostDto?> UpdateAsync(int id, CreateBlogPostDto dto, int authorId, IEnumerable<string> userRoles);

    /// <summary>
    /// Deletes a blog post by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the blog post to delete.</param>
    /// <param name="authorId">The ID of the author performing the deletion.</param>
    /// <param name="userRoles">The roles of the user performing the deletion.</param>
    /// <returns>True if the blog post was deleted and authorized; otherwise, false.</returns>
    Task<bool> DeleteAsync(int id, int authorId, IEnumerable<string> userRoles);
}
