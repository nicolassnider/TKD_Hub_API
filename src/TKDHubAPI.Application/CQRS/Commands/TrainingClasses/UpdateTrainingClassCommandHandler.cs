using AutoMapper;
using MediatR;
using TKDHubAPI.Application.DTOs.TrainingClass;
using TKDHubAPI.Application.Services;


namespace TKDHubAPI.Application.CQRS.Commands.TrainingClasses;


public class UpdateTrainingClassCommandHandler : IRequestHandler<UpdateTrainingClassCommand, TrainingClassDto>
{
    private readonly ITrainingClassService _trainingClassService;
    private readonly IMapper _mapper;


    public UpdateTrainingClassCommandHandler(ITrainingClassService trainingClassService, IMapper mapper)
    {
        _trainingClassService = trainingClassService;
        _mapper = mapper;
    }


    public async Task<TrainingClassDto> Handle(UpdateTrainingClassCommand request, CancellationToken cancellationToken)
    {
        // Map DTO to entity and update
        var entity = _mapper.Map<Domain.Entities.TrainingClass>(request.TrainingClassDto);
        entity.Id = request.Id;
        await _trainingClassService.UpdateAsync(entity);
       
        // Return the updated DTO
        return request.TrainingClassDto;
    }
}
