using AutoMapper;
using MediatR;
using TKDHubAPI.Application.DTOs.TrainingClass;
using TKDHubAPI.Application.Services;


namespace TKDHubAPI.Application.CQRS.Commands.TrainingClasses;


public class CreateTrainingClassCommandHandler : IRequestHandler<CreateTrainingClassCommand, TrainingClassDto>
{
    private readonly ITrainingClassService _trainingClassService;
    private readonly IMapper _mapper;


    public CreateTrainingClassCommandHandler(ITrainingClassService trainingClassService, IMapper mapper)
    {
        _trainingClassService = trainingClassService;
        _mapper = mapper;
    }


    public async Task<TrainingClassDto> Handle(CreateTrainingClassCommand request, CancellationToken cancellationToken)
    {
        var trainingClassEntity = _mapper.Map<TrainingClass>(request.CreateTrainingClassDto);
        var createdTrainingClass = await _trainingClassService.CreateAsync(trainingClassEntity);
        return _mapper.Map<TrainingClassDto>(createdTrainingClass);
    }
}
