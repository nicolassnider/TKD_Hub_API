using MediatR;


namespace TKDHubAPI.Application.CQRS.Queries.Coaches;


public class GetCoachByIdQueryHandler : IRequestHandler<GetCoachByIdQuery, UserDto>
{
    private readonly ICoachService _coachService;
    private readonly IMapper _mapper;


    public GetCoachByIdQueryHandler(ICoachService coachService, IMapper mapper)
    {
        _coachService = coachService;
        _mapper = mapper;
    }


    public async Task<UserDto> Handle(GetCoachByIdQuery request, CancellationToken cancellationToken)
    {
        var coach = await _coachService.GetCoachByIdAsync(request.Id);
        return _mapper.Map<UserDto>(coach);
    }
}
