using AutoMapper;
using MediatR;
using TKDHubAPI.Application.DTOs.Pagination;
using TKDHubAPI.Application.DTOs.TrainingClass;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Application.Services;

namespace TKDHubAPI.Application.CQRS.Queries.TrainingClasses;

public class GetAllTrainingClassesQueryHandler
    : IRequestHandler<GetAllTrainingClassesQuery, PaginatedResult<TrainingClassDto>>
{
    private readonly ITrainingClassService _trainingClassService;
    private readonly IPaginationService<TrainingClassDto> _paginationService;
    private readonly IMapper _mapper;

    public GetAllTrainingClassesQueryHandler(
        ITrainingClassService trainingClassService,
        IPaginationService<TrainingClassDto> paginationService,
        IMapper mapper
    )
    {
        _trainingClassService = trainingClassService;
        _paginationService = paginationService;
        _mapper = mapper;
    }

    public async Task<PaginatedResult<TrainingClassDto>> Handle(
        GetAllTrainingClassesQuery request,
        CancellationToken cancellationToken
    )
    {
        var trainingClasses = await _trainingClassService.GetAllAsync();
        var trainingClassDtos = _mapper.Map<IEnumerable<TrainingClassDto>>(trainingClasses);
        return await _paginationService.PaginateAsync(
            trainingClassDtos,
            request.Page,
            request.PageSize
        );
    }
}
