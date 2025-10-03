using AutoMapper;
using MediatR;
using TKDHubAPI.Application.DTOs.Dojaang;
using TKDHubAPI.Application.Interfaces;


namespace TKDHubAPI.Application.CQRS.Commands.Dojaangs;


public class CreateDojaangCommandHandler : IRequestHandler<CreateDojaangCommand, DojaangDto>
{
    private readonly IDojaangService _dojaangService;
    private readonly IMapper _mapper;


    public CreateDojaangCommandHandler(IDojaangService dojaangService, IMapper mapper)
    {
        _dojaangService = dojaangService;
        _mapper = mapper;
    }


    public async Task<DojaangDto> Handle(
        CreateDojaangCommand request,
        CancellationToken cancellationToken
    )
    {
        var createdDojaang = await _dojaangService.CreateDojaangAsync(
            request.CreateDojaangDto,
            request.CurrentUser
        );
        return createdDojaang;
    }
}
