using MediatR;


namespace TKDHubAPI.Application.CQRS.Queries.Users;


public class GetUserByIdQuery : IRequest<UserDto?>
{
    public int Id { get; set; }

    public GetUserByIdQuery(int id)
    {
        Id = id;
    }
}
