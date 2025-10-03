using MediatR;
using TKDHubAPI.Application.DTOs.TrainingClass;
using TKDHubAPI.Application.Services;


namespace TKDHubAPI.Application.CQRS.Queries.TrainingClasses;


public class GetAllTrainingClassesQueryHandler : IRequestHandler<GetAllTrainingClassesQuery, IEnumerable<TrainingClassDto>>
{
    private readonly ITrainingClassService _trainingClassService;
    private readonly IMapper _mapper;


    public GetAllTrainingClassesQueryHandler(ITrainingClassService trainingClassService, IMapper mapper)
    {
        _trainingClassService = trainingClassService;
        _mapper = mapper;
    }


    public async Task<IEnumerable<TrainingClassDto>> Handle(GetAllTrainingClassesQuery request, CancellationToken cancellationToken)
    {
        var trainingClasses = await _trainingClassService.GetAllAsync();
        return _mapper.Map<IEnumerable<TrainingClassDto>>(trainingClasses);
    }
}



