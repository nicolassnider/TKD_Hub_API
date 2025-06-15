namespace TKDHubAPI.Infrastructure.Repositories;

public class BlogPostRepository : IBlogPostRepository
{
    private readonly TkdHubDbContext _context;

    public BlogPostRepository(TkdHubDbContext context)
    {
        _context = context;
    }

    public async Task<BlogPost> AddAsync(BlogPost blogPost)
    {
        _context.BlogPosts.Add(blogPost);
        await _context.SaveChangesAsync();
        return blogPost;
    }

    public async Task<BlogPost?> GetByIdAsync(int id)
    {
        return await _context.BlogPosts
            .Include(b => b.Author)
            .FirstOrDefaultAsync(b => b.Id == id && b.IsActive);
    }

    public async Task<IEnumerable<BlogPost>> GetAllAsync()
    {
        return await _context.BlogPosts
            .Include(b => b.Author)
            .Where(b => b.IsActive)
            .ToListAsync();
    }

    public async Task UpdateAsync(BlogPost blogPost)
    {
        _context.BlogPosts.Update(blogPost);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var blogPost = await _context.BlogPosts.FindAsync(id);
        if (blogPost != null)
        {
            // Soft delete: set IsActive to false
            blogPost.IsActive = false;
            _context.BlogPosts.Update(blogPost);
            await _context.SaveChangesAsync();
        }
    }
}
