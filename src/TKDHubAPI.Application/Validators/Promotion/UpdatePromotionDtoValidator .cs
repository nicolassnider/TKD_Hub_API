public class UpdatePromotionDtoValidator : AbstractValidator<UpdatePromotionDto>
{
    public UpdatePromotionDtoValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id must be provided and greater than 0.");
        RuleFor(x => x.StudentId).GreaterThan(0).WithMessage("StudentId is required.");
        RuleFor(x => x.CoachId).GreaterThan(0).WithMessage("CoachId is required.");
        RuleFor(x => x.DojaangId).GreaterThan(0).WithMessage("DojaangId is required.");
        RuleFor(x => x.RankId).GreaterThan(0).WithMessage("RankId must be greater than 0.");
        RuleFor(x => x.PromotionDate).LessThanOrEqualTo(DateTime.UtcNow.AddDays(1)).WithMessage("PromotionDate cannot be in the far future.");
    }
}
