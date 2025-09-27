namespace TKDHubAPI.Infrastructure.Repositories;


public class BlogPostRepository : IBlogPostRepository
{
    private readonly TkdHubDbContext _context;


    public BlogPostRepository(TkdHubDbContext context)
    {
        _context = context;
    }


    public Task<BlogPost> AddAsync(BlogPost blogPost)
    {
        _context.BlogPosts.Add(blogPost);
        return Task.FromResult(blogPost);
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


    public Task UpdateAsync(BlogPost blogPost)
    {
        _context.BlogPosts.Update(blogPost);
        return Task.CompletedTask;
    }


    public async Task DeleteAsync(int id)
    {
        var blogPost = await _context.BlogPosts.FindAsync(id);
        if (blogPost != null)
        {
            // Soft delete: set IsActive to false
            blogPost.IsActive = false;
            _context.BlogPosts.Update(blogPost);
        }
    }
}
