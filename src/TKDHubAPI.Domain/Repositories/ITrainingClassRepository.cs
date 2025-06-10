namespace TKDHubAPI.Domain.Repositories;
public interface ITrainingClassRepository
{
    Task<TrainingClass> GetByIdAsync(int id);
    Task<IEnumerable<TrainingClass>> GetAllAsync();
    Task<TrainingClass> AddAsync(TrainingClass entity);
    Task UpdateAsync(TrainingClass entity);
    Task DeleteAsync(int id);
}
