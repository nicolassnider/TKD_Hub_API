namespace TKDHubAPI.Domain.Repositories;
public interface IClassScheduleRepository
{
    Task<ClassSchedule> GetByIdAsync(int id);
    Task<IEnumerable<ClassSchedule>> GetByTrainingClassIdAsync(int trainingClassId);
    Task<ClassSchedule> AddAsync(ClassSchedule entity);
    Task UpdateAsync(ClassSchedule entity);
    Task DeleteAsync(int id);
}
