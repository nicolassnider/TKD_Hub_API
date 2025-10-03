using MediatR;
using TKDHubAPI.Application.DTOs.User;


namespace TKDHubAPI.Application.CQRS.Commands.Students;


public class CreateStudentCommand : IRequest<UserDto>
{
    public CreateStudentDto CreateStudentDto { get; set; } = null!;
    public int RequestingUserId { get; set; }
    public IEnumerable<string> CurrentUserRoles { get; set; } = Enumerable.Empty<string>();
}
