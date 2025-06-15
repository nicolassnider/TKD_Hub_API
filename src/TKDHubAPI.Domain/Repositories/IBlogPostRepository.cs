namespace TKDHubAPI.Domain.Repositories;


/// <summary>
/// Defines a contract for data access operations on <see cref="BlogPost"/> entities.
/// Provides methods for creating, retrieving, updating, and deleting blog posts.
/// </summary>
public interface IBlogPostRepository
{
    /// <summary>
    /// Asynchronously adds a new <see cref="BlogPost"/> to the data store.
    /// </summary>
    /// <param name="blogPost">The blog post entity to add.</param>
    /// <returns>The created <see cref="BlogPost"/> entity.</returns>
    Task<BlogPost> AddAsync(BlogPost blogPost);

    /// <summary>
    /// Asynchronously retrieves a <see cref="BlogPost"/> by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the blog post.</param>
    /// <returns>The <see cref="BlogPost"/> if found; otherwise, <c>null</c>.</returns>
    Task<BlogPost?> GetByIdAsync(int id);

    /// <summary>
    /// Asynchronously retrieves all <see cref="BlogPost"/> entities.
    /// </summary>
    /// <returns>An enumerable collection of all <see cref="BlogPost"/> entities.</returns>
    Task<IEnumerable<BlogPost>> GetAllAsync();

    /// <summary>
    /// Asynchronously updates an existing <see cref="BlogPost"/> in the data store.
    /// </summary>
    /// <param name="blogPost">The blog post entity with updated values.</param>
    Task UpdateAsync(BlogPost blogPost);

    /// <summary>
    /// Asynchronously deletes a <see cref="BlogPost"/> by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the blog post to delete.</param>
    Task DeleteAsync(int id);
}
