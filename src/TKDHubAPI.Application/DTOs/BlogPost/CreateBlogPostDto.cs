﻿namespace TKDHubAPI.Application.DTOs.BlogPost;

[ExcludeFromCodeCoverage]
public class CreateBlogPostDto
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}
