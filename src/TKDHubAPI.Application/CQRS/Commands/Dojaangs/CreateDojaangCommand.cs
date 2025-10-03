using MediatR;
using TKDHubAPI.Application.DTOs.Dojaang;
using TKDHubAPI.Domain.Entities;


namespace TKDHubAPI.Application.CQRS.Commands.Dojaangs;


public class CreateDojaangCommand : IRequest<DojaangDto>
{
    public CreateDojaangDto CreateDojaangDto { get; set; } = null!;
    public User CurrentUser { get; set; } = null!;
}
