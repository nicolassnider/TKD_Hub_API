using MediatR;
using TKDHubAPI.Application.DTOs.User;

namespace TKDHubAPI.Application.CQRS.Queries.Coaches;

public class GetCoachesByDojaangQuery : IRequest<IEnumerable<UserDto>>
{
    public int DojaangId { get; set; }
}
