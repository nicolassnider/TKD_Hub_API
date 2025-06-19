using TKDHubAPI.Application.DTOs.BlogPost;

namespace TKDHubAPI.Application.Mappings;

/// <summary>
/// AutoMapper profile for mapping between BlogPost and BlogPostDto.
/// </summary>
public class BlogPostMappingProfile : Profile
{
    public BlogPostMappingProfile()
    {
        CreateMap<BlogPost, BlogPostDto>()
            .ForMember(
                dest => dest.AuthorName,
                opt => opt.MapFrom(src =>
                    src.Author != null
                        ? $"{src.Author.FirstName} {src.Author.LastName}".Trim()
                        : null
                )
            );

        CreateMap<CreateBlogPostDto, BlogPost>();
    }
}
