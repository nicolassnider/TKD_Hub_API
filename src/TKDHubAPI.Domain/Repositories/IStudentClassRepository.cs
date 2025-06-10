namespace TKDHubAPI.Domain.Repositories;
public interface IStudentClassRepository
{
    Task<StudentClass> GetByIdAsync(int id);
    Task<IEnumerable<StudentClass>> GetByTrainingClassIdAsync(int trainingClassId);
    Task<IEnumerable<StudentClass>> GetByStudentIdAsync(int studentId);
    Task<StudentClass> AddAsync(StudentClass entity);
    Task UpdateAsync(StudentClass entity);
    Task DeleteAsync(int id);
}
