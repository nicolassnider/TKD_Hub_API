using TKDHubAPI.Application.Constants;
using TKDHubAPI.Application.DTOs.BlogPost;

namespace TKDHubAPI.Application.Validators.BlogPost;

public class CreateBlogPostDtoValidator : AbstractValidator<CreateBlogPostDto>
{
    public CreateBlogPostDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage(ValidationMessages.TitleRequired)
            .MaximumLength(200).WithMessage(ValidationMessages.TitleMaxLength);

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage(ValidationMessages.ContentRequired)
            .MaximumLength(50000).WithMessage(ValidationMessages.ContentTooLong);
    }
}
