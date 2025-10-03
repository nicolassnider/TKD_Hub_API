using MediatR;
using TKDHubAPI.Application.DTOs.TrainingClass;


namespace TKDHubAPI.Application.CQRS.Commands.TrainingClasses;


public class UpdateTrainingClassCommand : IRequest<TrainingClassDto>
{
    public int Id { get; set; }
    public TrainingClassDto TrainingClassDto { get; set; } = null!;
}
