﻿public partial class BlogPost : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int AuthorId { get; set; }
    public User Author { get; set; }
    public bool IsActive { get; set; } = true; // For soft delete
}
