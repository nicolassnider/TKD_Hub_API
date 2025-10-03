using MediatR;
using TKDHubAPI.Application.DTOs.TrainingClass;


namespace TKDHubAPI.Application.CQRS.Queries.TrainingClasses;


public class GetTrainingClassByIdQuery : IRequest<TrainingClassDto?>
{
    public int Id { get; set; }
}
