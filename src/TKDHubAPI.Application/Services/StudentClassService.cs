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

    public async Task<IEnumerable<User>> GetStudentsByTrainingClassIdAsync(int trainingClassId)
    {
        var studentClasses = await _studentClassRepository.GetByTrainingClassIdAsync(trainingClassId);
        // Select the Student property from each StudentClass, filter out nulls, and return distinct students
        return studentClasses
            .Where(sc => sc.Student != null)
            .Select(sc => sc.Student)
            .Distinct()
            .ToList();
    }
}
