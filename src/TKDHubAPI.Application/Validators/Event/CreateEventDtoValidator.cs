using FluentValidation;
using TKDHubAPI.Application.DTOs.Event;


namespace TKDHubAPI.Application.Validators.Event;


public class CreateEventDtoValidator : AbstractValidator<CreateEventDto>
{
    public CreateEventDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.").MaximumLength(200);
        RuleFor(x => x.Type).GreaterThanOrEqualTo(0).WithMessage("Type is required.");
        RuleFor(x => x.StartDate).LessThan(x => x.EndDate).WithMessage("StartDate must be before EndDate.");
        RuleFor(x => x.CoachId).GreaterThan(0).WithMessage("CoachId is required.");
    }
}


public class UpdateEventDtoValidator : AbstractValidator<UpdateEventDto>
{
    public UpdateEventDtoValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id must be provided and greater than 0.");
        RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.").MaximumLength(200);
        RuleFor(x => x.Type).GreaterThanOrEqualTo(0).WithMessage("Type is required.");
        RuleFor(x => x.StartDate).LessThan(x => x.EndDate).WithMessage("StartDate must be before EndDate.");
        RuleFor(x => x.CoachId).GreaterThan(0).WithMessage("CoachId is required.");
    }
}
