using AutoMapper;
using MediatR;
using TKDHubAPI.Application.DTOs.Dojaang;
using TKDHubAPI.Application.Interfaces;


namespace TKDHubAPI.Application.CQRS.Commands.Dojaangs;


public class UpdateDojaangCommandHandler : IRequestHandler<UpdateDojaangCommand, DojaangDto>
{
    private readonly IDojaangService _dojaangService;
    private readonly IMapper _mapper;


    public UpdateDojaangCommandHandler(IDojaangService dojaangService, IMapper mapper)
    {
        _dojaangService = dojaangService;
        _mapper = mapper;
    }


    public async Task<DojaangDto> Handle(UpdateDojaangCommand request, CancellationToken cancellationToken)
    {
        // Set the ID in the DTO
        request.UpdateDojaangDto.Id = request.Id;
        await _dojaangService.UpdateAsync(request.UpdateDojaangDto);
       
        // Retrieve the updated dojaang
        var updatedDojaang = await _dojaangService.GetByIdAsync(request.Id);
        return _mapper.Map<DojaangDto>(updatedDojaang);
    }
}
