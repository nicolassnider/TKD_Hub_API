using TKDHubAPI.Application.DTOs.BlogPost;

namespace TKDHubAPI.Application.Test.Services;

public class BlogPostServiceTest : BaseServiceTest<BlogPostService, IBlogPostRepository>
{
    public BlogPostServiceTest()
         : base((repoMock, _) => new BlogPostService(repoMock.Object, new Mock<IMapper>().Object))
    {
    }

    #region CreateAsync

    [Fact]
    public async Task CreateAsync_ShouldReturnCreatedBlogPostDto()
    {
        // Arrange
        var dto = new CreateBlogPostDto { Title = "Test", Content = "Content" };
        var authorId = 1;
        var userRoles = new[] { "User" };
        var blogPost = new BlogPost { Id = 1, Title = "Test", Content = "Content", AuthorId = authorId, IsActive = true };
        var blogPostDto = new BlogPostDto { Id = 1, Title = "Test", Content = "Content", AuthorId = authorId, IsActive = true };

        var mapperMock = new Mock<IMapper>();
        mapperMock.Setup(m => m.Map<BlogPost>(dto)).Returns(blogPost);
        mapperMock.Setup(m => m.Map<BlogPostDto>(It.IsAny<BlogPost>())).Returns(blogPostDto);

        RepoMock.Setup(r => r.AddAsync(It.IsAny<BlogPost>())).ReturnsAsync(blogPost);

        var service = new BlogPostService(RepoMock.Object, mapperMock.Object);

        // Act
        var result = await service.CreateAsync(dto, authorId, userRoles);

        // Assert
        result.Should().NotBeNull();
        result.Title.Should().Be("Test");
        result.Content.Should().Be("Content");
        result.AuthorId.Should().Be(authorId);
    }

    #endregion

    #region GetByIdAsync

    [Fact]
    public async Task GetByIdAsync_ShouldReturnBlogPostDto_WhenFound()
    {
        // Arrange
        var id = 1;
        var blogPost = new BlogPost { Id = id, Title = "Test", Content = "Content", AuthorId = 1, IsActive = true };
        var blogPostDto = new BlogPostDto { Id = id, Title = "Test", Content = "Content", AuthorId = 1, IsActive = true };

        RepoMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(blogPost);

        var mapperMock = new Mock<IMapper>();
        mapperMock.Setup(m => m.Map<BlogPostDto>(blogPost)).Returns(blogPostDto);

        var service = new BlogPostService(RepoMock.Object, mapperMock.Object);

        // Act
        var result = await service.GetByIdAsync(id);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(id);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnNull_WhenNotFound()
    {
        // Arrange
        var id = 99;
        RepoMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((BlogPost?)null);

        var mapperMock = new Mock<IMapper>();
        var service = new BlogPostService(RepoMock.Object, mapperMock.Object);

        // Act
        var result = await service.GetByIdAsync(id);

        // Assert
        result.Should().BeNull();
    }

    #endregion

    #region GetAllAsync

    [Fact]
    public async Task GetAllAsync_ShouldReturnAllBlogPosts()
    {
        // Arrange
        var blogPosts = new List<BlogPost>
        {
            new BlogPost { Id = 1, Title = "A", Content = "A", AuthorId = 1, IsActive = true },
            new BlogPost { Id = 2, Title = "B", Content = "B", AuthorId = 2, IsActive = true }
        };
        var blogPostDtos = new List<BlogPostDto>
        {
            new BlogPostDto { Id = 1, Title = "A", Content = "A", AuthorId = 1, IsActive = true },
            new BlogPostDto { Id = 2, Title = "B", Content = "B", AuthorId = 2, IsActive = true }
        };

        RepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(blogPosts);

        var mapperMock = new Mock<IMapper>();
        mapperMock.Setup(m => m.Map<IEnumerable<BlogPostDto>>(blogPosts)).Returns(blogPostDtos);

        var service = new BlogPostService(RepoMock.Object, mapperMock.Object);

        // Act
        var result = await service.GetAllAsync();

        // Assert
        result.Should().HaveCount(2);
        result.Should().ContainSingle(x => x.Id == 1);
        result.Should().ContainSingle(x => x.Id == 2);
    }

    #endregion

    #region UpdateAsync

    [Fact]
    public async Task UpdateAsync_ShouldReturnUpdatedBlogPostDto_WhenAuthorized()
    {
        // Arrange
        var id = 1;
        var dto = new CreateBlogPostDto { Title = "Updated", Content = "Updated Content" };
        var userId = 1;
        var userRoles = new[] { "Coach" };
        var blogPost = new BlogPost { Id = id, Title = "Old", Content = "Old", AuthorId = userId, IsActive = true };
        var updatedBlogPost = new BlogPost { Id = id, Title = "Updated", Content = "Updated Content", AuthorId = userId, IsActive = true };
        var blogPostDto = new BlogPostDto { Id = id, Title = "Updated", Content = "Updated Content", AuthorId = userId, IsActive = true };

        RepoMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(blogPost);

        var mapperMock = new Mock<IMapper>();
        mapperMock.Setup(m => m.Map<BlogPostDto>(It.IsAny<BlogPost>())).Returns(blogPostDto);

        var service = new BlogPostService(RepoMock.Object, mapperMock.Object);

        // Act
        var result = await service.UpdateAsync(id, dto, userId, userRoles);

        // Assert
        result.Should().NotBeNull();
        result.Title.Should().Be("Updated");
        result.Content.Should().Be("Updated Content");
    }

    #endregion

    #region DeleteAsync

    [Fact]
    public async Task DeleteAsync_ShouldReturnTrue_WhenAuthorizedAndDeleted()
    {
        // Arrange
        var id = 1;
        var userId = 1;
        var userRoles = new[] { "Admin" };
        var blogPost = new BlogPost { Id = id, Title = "Test", Content = "Test", AuthorId = userId, IsActive = true };

        RepoMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(blogPost);

        var mapperMock = new Mock<IMapper>();
        var service = new BlogPostService(RepoMock.Object, mapperMock.Object);

        // Act
        var result = await service.DeleteAsync(id, userId, userRoles);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public async Task DeleteAsync_ShouldReturnFalse_WhenNotFound()
    {
        // Arrange
        var id = 99;
        var userId = 1;
        var userRoles = new[] { "Admin" };

        RepoMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((BlogPost?)null);

        var mapperMock = new Mock<IMapper>();
        var service = new BlogPostService(RepoMock.Object, mapperMock.Object);

        // Act
        var result = await service.DeleteAsync(id, userId, userRoles);

        // Assert
        result.Should().BeFalse();
    }

    #endregion
}
