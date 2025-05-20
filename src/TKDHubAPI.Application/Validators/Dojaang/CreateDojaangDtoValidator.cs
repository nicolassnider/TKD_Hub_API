using FluentValidation;
using TKDHubAPI.Application.DTOs.Dojaang;

namespace TKDHubAPI.Application.Validators.Dojaang;
public class CreateDojaangDtoValidator : AbstractValidator<CreateDojaangDto>
{
    public CreateDojaangDtoValidator()
    {
        RuleFor(d => d.Name)
            .NotEmpty().WithMessage("Dojaang name is required.")
            .MaximumLength(200).WithMessage("Dojaang name cannot exceed 200 characters.");

        RuleFor(d => d.Address)
            .NotEmpty().WithMessage("Address is required.")
            .MaximumLength(255).WithMessage("Address cannot exceed 255 characters.");

        RuleFor(d => d.PhoneNumber)
            .MaximumLength(20).WithMessage("Phone number cannot exceed 20 characters.")
            .Matches(@"^\+?[0-9\s-]+$").WithMessage("Phone number must be in a valid format.");

        RuleFor(d => d.Email)
            .MaximumLength(255).WithMessage("Email cannot exceed 255 characters.")
            .EmailAddress().WithMessage("Email must be in a valid format.")
            .When(d => !string.IsNullOrEmpty(d.Email));

        RuleFor(d => d.KoreanName)
            .MaximumLength(100).WithMessage("Korean name cannot exceed 100 characters.");

        RuleFor(d => d.KoreanNamePhonetic)
            .MaximumLength(100).WithMessage("Korean phonetic name cannot exceed 100 characters.");

        RuleFor(d => d.CoachId)
            .GreaterThan(0).WithMessage("Coach ID must be a positive number.");
    }
}
