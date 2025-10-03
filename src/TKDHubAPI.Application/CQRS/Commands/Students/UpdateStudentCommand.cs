using MediatR;
using TKDHubAPI.Application.DTOs.User;


namespace TKDHubAPI.Application.CQRS.Commands.Students;


public class UpdateStudentCommand : IRequest<UserDto?>
{
    public int Id { get; set; }
    public UpdateStudentDto UpdateStudentDto { get; set; } = null!;
}
