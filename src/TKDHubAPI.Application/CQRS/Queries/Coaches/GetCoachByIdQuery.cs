using MediatR;


namespace TKDHubAPI.Application.CQRS.Queries.Coaches;


public class GetCoachByIdQuery : IRequest<UserDto>
{
    public int Id { get; set; }
}
