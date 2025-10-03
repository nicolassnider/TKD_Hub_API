using MediatR;


namespace TKDHubAPI.Application.CQRS.Queries.Students;


public class GetStudentByIdQueryHandler : IRequestHandler<GetStudentByIdQuery, UserDto?>
{
    private readonly IStudentService _studentService;


    public GetStudentByIdQueryHandler(IStudentService studentService)
    {
        _studentService = studentService;
    }


    public async Task<UserDto?> Handle(GetStudentByIdQuery request, CancellationToken cancellationToken)
    {
        return await _studentService.GetStudentByIdAsync(request.Id);
    }
}
