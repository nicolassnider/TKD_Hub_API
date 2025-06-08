namespace TKDHubAPI.Domain.Repositories;
public interface IUserDojaangRepository
{
    Task<UserDojaang?> GetCoachRelationForDojaangAsync(int dojaangId);
    Task<IEnumerable<UserDojaang>> GetAllAsync();
    Task AddAsync(UserDojaang entity);
    // Add more methods as needed (e.g., Remove, Update, etc.)
}
