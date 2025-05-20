using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.Domain.Repositories;
public interface IUserRepository : IGenericRepository<User>
{
    Task<User?> GetUserByEmailAsync(string email);
    Task<User?> GetUserByPhoneNumberAsync(string phoneNumber);
    Task<IEnumerable<User>> GetUsersByGenderAsync(Gender gender);
    Task<IEnumerable<User>> GetUsersByRoleAsync(UserRole role);
}
