using Ganss.Xss;
using TKDHubAPI.Application.DTOs.BlogPost;

namespace TKDHubAPI.Application.Services;

public class BlogPostService : IBlogPostService
{
    private readonly IBlogPostRepository _blogPostRepository;
    private readonly IMapper _mapper;
    private readonly HtmlSanitizer _htmlSanitizer;

    public BlogPostService(IBlogPostRepository blogPostRepository, IMapper mapper)
    {
        _blogPostRepository = blogPostRepository;
        _mapper = mapper;
        _htmlSanitizer = new HtmlSanitizer(); // You can configure allowed tags/attributes here if needed
    }

    private string SanitizeHtml(string html)
    {
        return _htmlSanitizer.Sanitize(html);
    }

    public async Task<BlogPostDto> CreateAsync(CreateBlogPostDto dto, int authorId, IEnumerable<string> userRoles)
    {
        // All roles can create posts
        var blogPost = new BlogPost
        {
            Title = dto.Title,
            Content = SanitizeHtml(dto.Content),
            AuthorId = authorId,
            IsActive = true
        };

        var created = await _blogPostRepository.AddAsync(blogPost);
        return _mapper.Map<BlogPostDto>(created);
    }

    public async Task<BlogPostDto?> GetByIdAsync(int id)
    {
        var blogPost = await _blogPostRepository.GetByIdAsync(id);
        return blogPost == null ? null : _mapper.Map<BlogPostDto>(blogPost);
    }

    public async Task<IEnumerable<BlogPostDto>> GetAllAsync()
    {
        var blogPosts = await _blogPostRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<BlogPostDto>>(blogPosts);
    }

    public async Task<BlogPostDto?> UpdateAsync(int id, CreateBlogPostDto dto, int userId, IEnumerable<string> userRoles)
    {
        var blogPost = await _blogPostRepository.GetByIdAsync(id);
        if (blogPost == null || !blogPost.IsActive)
            return null;

        bool isAdmin = userRoles.Contains("Admin");
        bool isCoach = userRoles.Contains("Coach");

        // Admin can update any post, coach can update their own post
        if (isAdmin || (isCoach && blogPost.AuthorId == userId))
        {
            blogPost.Title = dto.Title;
            blogPost.Content = SanitizeHtml(dto.Content);
            await _blogPostRepository.UpdateAsync(blogPost);
            return _mapper.Map<BlogPostDto>(blogPost);
        }

        // Not authorized
        return null;
    }

    public async Task<bool> DeleteAsync(int id, int userId, IEnumerable<string> userRoles)
    {
        var blogPost = await _blogPostRepository.GetByIdAsync(id);
        if (blogPost == null || !blogPost.IsActive)
            return false;

        bool isAdmin = userRoles.Contains("Admin");
        bool isCoach = userRoles.Contains("Coach");

        // Admin can delete any post, coach can delete their own post
        if (isAdmin || (isCoach && blogPost.AuthorId == userId))
        {
            await _blogPostRepository.DeleteAsync(id);
            return true;
        }

        // Not authorized
        return false;
    }
}
