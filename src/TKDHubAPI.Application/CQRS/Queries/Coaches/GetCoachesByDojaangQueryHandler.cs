using AutoMapper;
using MediatR;
using TKDHubAPI.Application.DTOs.User;
using TKDHubAPI.Application.Interfaces;

namespace TKDHubAPI.Application.CQRS.Queries.Coaches;

public class GetCoachesByDojaangQueryHandler : IRequestHandler<GetCoachesByDojaangQuery, IEnumerable<UserDto>>
{
    private readonly ICoachService _service;
    private readonly IMapper _mapper;

    public GetCoachesByDojaangQueryHandler(ICoachService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    public async Task<IEnumerable<UserDto>> Handle(GetCoachesByDojaangQuery request, CancellationToken cancellationToken)
    {
        var coaches = await _service.GetCoachesByDojaangAsync(request.DojaangId);
        return coaches;
    }
}
