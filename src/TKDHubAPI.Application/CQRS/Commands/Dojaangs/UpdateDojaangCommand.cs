using MediatR;
using TKDHubAPI.Application.DTOs.Dojaang;


namespace TKDHubAPI.Application.CQRS.Commands.Dojaangs;


public class UpdateDojaangCommand : IRequest<DojaangDto>
{
    public int Id { get; set; }
    public UpdateDojaangDto UpdateDojaangDto { get; set; } = null!;
}
