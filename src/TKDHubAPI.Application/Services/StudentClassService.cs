namespace TKDHubAPI.Application.Services;

public class StudentClassService : IStudentClassService
{
    private readonly IStudentClassRepository _studentClassRepository;

    public StudentClassService(IStudentClassRepository studentClassRepository)
    {
        _studentClassRepository = studentClassRepository;
    }

    public async Task<StudentClass> CreateAsync(StudentClass studentClass)
    {
        return await _studentClassRepository.AddAsync(studentClass);
    }

    public async Task DeleteAsync(int id)
    {
        await _studentClassRepository.DeleteAsync(id);
    }

    public async Task<StudentClass> GetByIdAsync(int id)
    {
        return await _studentClassRepository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<StudentClass>> GetByStudentIdAsync(int studentId)
    {
        return await _studentClassRepository.GetByStudentIdAsync(studentId);
    }

    public async Task<IEnumerable<StudentClass>> GetByTrainingClassIdAsync(int trainingClassId)
    {
        return await _studentClassRepository.GetByTrainingClassIdAsync(trainingClassId);
    }

    public async Task UpdateAsync(StudentClass studentClass)
    {
        await _studentClassRepository.UpdateAsync(studentClass);
    }
}
