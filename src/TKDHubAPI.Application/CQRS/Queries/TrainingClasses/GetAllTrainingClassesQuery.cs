using MediatR;
using TKDHubAPI.Application.DTOs.TrainingClass;


namespace TKDHubAPI.Application.CQRS.Queries.TrainingClasses;


public class GetAllTrainingClassesQuery : IRequest<IEnumerable<TrainingClassDto>>
{
}