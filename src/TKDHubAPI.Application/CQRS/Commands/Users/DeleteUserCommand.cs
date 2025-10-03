using MediatR;


namespace TKDHubAPI.Application.CQRS.Commands.Users;


public class DeleteUserCommand : IRequest<Unit>
{
    public int Id { get; set; }
   
    public DeleteUserCommand(int id)
    {
        Id = id;
    }
}
