namespace TKDHubAPI.Application.Services;

public class ClassScheduleService : IClassScheduleService
{
    private readonly IClassScheduleRepository _classScheduleRepository;

    public ClassScheduleService(IClassScheduleRepository classScheduleRepository)
    {
        _classScheduleRepository = classScheduleRepository;
    }

    public async Task<ClassSchedule> CreateAsync(ClassSchedule schedule)
    {
        return await _classScheduleRepository.AddAsync(schedule);
    }

    public async Task DeleteAsync(int id)
    {
        await _classScheduleRepository.DeleteAsync(id);
    }

    public async Task<ClassSchedule> GetByIdAsync(int id)
    {
        return await _classScheduleRepository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<ClassSchedule>> GetByTrainingClassIdAsync(int trainingClassId)
    {
        return await _classScheduleRepository.GetByTrainingClassIdAsync(trainingClassId);
    }

    public async Task UpdateAsync(ClassSchedule schedule)
    {
        await _classScheduleRepository.UpdateAsync(schedule);
    }
}
