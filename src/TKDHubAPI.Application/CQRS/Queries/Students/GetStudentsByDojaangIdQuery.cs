using MediatR;


namespace TKDHubAPI.Application.CQRS.Queries.Students;


public class GetStudentsByDojaangIdQuery : IRequest<IEnumerable<UserDto>>
{
    public int DojaangId { get; set; }

    public GetStudentsByDojaangIdQuery(int dojaangId)
    {
        DojaangId = dojaangId;
    }
}
