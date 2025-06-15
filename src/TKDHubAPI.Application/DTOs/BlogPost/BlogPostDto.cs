namespace TKDHubAPI.Application.DTOs.BlogPost;

public class BlogPostDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int AuthorId { get; set; }
    public string? AuthorName { get; set; }
    public bool IsActive { get; set; }
}

