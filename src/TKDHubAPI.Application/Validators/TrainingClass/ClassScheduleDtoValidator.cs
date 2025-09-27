using TKDHubAPI.Application.DTOs.TrainingClass;

namespace TKDHubAPI.Application.Validators.TrainingClass;


public class ClassScheduleDtoValidator : AbstractValidator<ClassScheduleDto>
{
    public ClassScheduleDtoValidator()
    {
        RuleFor(x => x.Day).IsInEnum().WithMessage("Day must be a valid day of week.");
        RuleFor(x => x.StartTime).NotEmpty().WithMessage("StartTime is required.");
        RuleFor(x => x.EndTime).NotEmpty().WithMessage("EndTime is required.");
        RuleFor(x => x)
            .Must(x => x.EndTime > x.StartTime)
            .WithMessage("EndTime must be after StartTime.");
    }
}
