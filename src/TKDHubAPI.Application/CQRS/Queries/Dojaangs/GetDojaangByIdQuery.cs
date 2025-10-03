using MediatR;


namespace TKDHubAPI.Application.CQRS.Queries.Dojaangs;


public class GetDojaangByIdQuery : IRequest<DojaangDto?>
{
    public int Id { get; set; }
}
