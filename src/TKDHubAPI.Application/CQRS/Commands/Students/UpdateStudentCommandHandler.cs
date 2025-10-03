using MediatR;
using TKDHubAPI.Application.DTOs.User;
using TKDHubAPI.Application.Interfaces;


namespace TKDHubAPI.Application.CQRS.Commands.Students;


public class UpdateStudentCommandHandler : IRequestHandler<UpdateStudentCommand, UserDto?>
{
    private readonly IStudentService _studentService;


    public UpdateStudentCommandHandler(IStudentService studentService)
    {
        _studentService = studentService;
    }


    public async Task<UserDto?> Handle(UpdateStudentCommand request, CancellationToken cancellationToken)
    {
        return await _studentService.UpdateStudentAsync(request.Id, request.UpdateStudentDto);
    }
}
