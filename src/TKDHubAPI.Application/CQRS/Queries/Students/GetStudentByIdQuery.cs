using MediatR;

namespace TKDHubAPI.Application.CQRS.Queries.Students;


public class GetStudentByIdQuery : IRequest<UserDto?>
{
    public int Id { get; set; }

    public GetStudentByIdQuery(int id)
    {
        Id = id;
    }
}
