using MediatR;
using TKDHubAPI.Application.DTOs.TrainingClass;


namespace TKDHubAPI.Application.CQRS.Commands.TrainingClasses;


public class CreateTrainingClassCommand : IRequest<TrainingClassDto>
{
    public CreateTrainingClassDto CreateTrainingClassDto { get; set; } = null!;
}
