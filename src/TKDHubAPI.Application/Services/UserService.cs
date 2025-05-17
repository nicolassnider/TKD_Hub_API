using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.Application.Services;
public class UserService : IUserService
{
    public Task AddAsync(User user)
    {
        throw new NotImplementedException();
    }

    public Task DeleteAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<User>> GetAllAsync()
    {
        throw new NotImplementedException();
    }

    public Task<User?> GetByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task UpdateAsync(User user)
    {
        throw new NotImplementedException();
    }
}
