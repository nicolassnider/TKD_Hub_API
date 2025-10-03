using MediatR;
using TKDHubAPI.Application.DTOs.TrainingClass;
using TKDHubAPI.Application.Services;


namespace TKDHubAPI.Application.CQRS.Queries.TrainingClasses;


public class GetTrainingClassByIdQueryHandler : IRequestHandler<GetTrainingClassByIdQuery, TrainingClassDto?>
{
    private readonly ITrainingClassService _trainingClassService;
    private readonly IMapper _mapper;


    public GetTrainingClassByIdQueryHandler(ITrainingClassService trainingClassService, IMapper mapper)
    {
        _trainingClassService = trainingClassService;
        _mapper = mapper;
    }


    public async Task<TrainingClassDto?> Handle(GetTrainingClassByIdQuery request, CancellationToken cancellationToken)
    {
        var trainingClass = await _trainingClassService.GetByIdAsync(request.Id);
        return trainingClass != null ? _mapper.Map<TrainingClassDto>(trainingClass) : null;
    }
}



