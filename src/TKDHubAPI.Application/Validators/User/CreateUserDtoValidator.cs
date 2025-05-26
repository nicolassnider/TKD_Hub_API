using TKDHubAPI.Application.DTOs.User;

namespace TKDHubAPI.Application.Validators.User;
public class CreateUserDtoValidator : AbstractValidator<CreateUserDto>
{
    public CreateUserDtoValidator()
    {
        RuleFor(dto => dto.FirstName)
            .NotEmpty().WithMessage("FirstName is required.")
            .MaximumLength(100).WithMessage("FirstName must not exceed 100 characters.");

        RuleFor(dto => dto.LastName)
            .NotEmpty().WithMessage("LastName is required.")
            .MaximumLength(100).WithMessage("LastName must not exceed 100 characters.");

        RuleFor(dto => dto.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Email is not valid.")
            .MaximumLength(255).WithMessage("Email must not exceed 255 characters.");

        RuleFor(dto => dto.PhoneNumber)
            .NotEmpty().WithMessage("PhoneNumber is required.")
            .MaximumLength(20).WithMessage("PhoneNumber must not exceed 20 characters.");

        RuleFor(dto => dto.Gender)
            .IsInEnum().WithMessage("Gender is required and must be a valid Gender value.");

        RuleFor(dto => dto.RoleIds)
            .NotNull().WithMessage("At least one role is required.")
            .Must(list => list != null && list.Count > 0).WithMessage("At least one role is required.")
            .ForEach(idRule => idRule.GreaterThan(0).WithMessage("RoleId must be greater than 0."));

        RuleFor(dto => dto.RankId)
            .Null().When(dto => dto.RankId == null)
            .GreaterThan(0).WithMessage("RankId must be greater than 0.");
    }
}
