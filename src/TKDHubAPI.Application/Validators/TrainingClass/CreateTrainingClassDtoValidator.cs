using TKDHubAPI.Application.DTOs.TrainingClass;
using TKDHubAPI.Application.Validators.TrainingClass;

public class CreateTrainingClassDtoValidator : AbstractValidator<CreateTrainingClassDto>
{
    public CreateTrainingClassDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Name is required.")
            .MaximumLength(200);


        RuleFor(x => x.DojaangId)
            .GreaterThan(0)
            .WithMessage("DojaangId must be provided.");


        RuleFor(x => x.CoachId)
            .GreaterThan(0)
            .WithMessage("CoachId must be provided.");


        RuleForEach<ClassScheduleDto>(x => x.Schedules)
            .SetValidator(new ClassScheduleDtoValidator());
    }
}
