using MediatR;


namespace TKDHubAPI.Application.CQRS.Queries.Students;


public class GetStudentsByDojaangIdQueryHandler : IRequestHandler<GetStudentsByDojaangIdQuery, IEnumerable<UserDto>>
{
    private readonly IStudentService _studentService;


    public GetStudentsByDojaangIdQueryHandler(IStudentService studentService)
    {
        _studentService = studentService;
    }


    public async Task<IEnumerable<UserDto>> Handle(GetStudentsByDojaangIdQuery request, CancellationToken cancellationToken)
    {
        return await _studentService.GetStudentsByDojaangIdAsync(request.DojaangId);
    }
}
