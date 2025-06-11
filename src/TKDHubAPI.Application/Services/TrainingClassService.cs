using TKDHubAPI.Application.DTOs.TrainingClass;

namespace TKDHubAPI.Application.Services;

public class TrainingClassService : ITrainingClassService
{
    private readonly ITrainingClassRepository _trainingClassRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;

    public TrainingClassService(ITrainingClassRepository trainingClassRepository, ICurrentUserService currentUserService, IMapper mapper)
    {
        _trainingClassRepository = trainingClassRepository;
        _currentUserService = currentUserService;
        _mapper = mapper;
    }

    public async Task<TrainingClass> CreateAsync(TrainingClass trainingClass)
    {
        // Check for coach schedule conflicts
        await EnsureNoCoachScheduleConflict(trainingClass);

        return await _trainingClassRepository.AddAsync(trainingClass);
    }

    public async Task UpdateAsync(TrainingClass trainingClass)
    {
        // Check for coach schedule conflicts
        await EnsureNoCoachScheduleConflict(trainingClass);

        await _trainingClassRepository.UpdateAsync(trainingClass);
    }

    public async Task DeleteAsync(int id)
    {
        await _trainingClassRepository.DeleteAsync(id);
    }

    public async Task<IEnumerable<TrainingClass>> DeleteAsync()
    {
        return await _trainingClassRepository.GetAllAsync();
    }

    public async Task<TrainingClass> GetByIdAsync(int id)
    {
        return await _trainingClassRepository.GetByIdAsync(id);
    }

    public async Task<bool> HasCoachScheduleConflictAsync(int coachId, IEnumerable<ClassSchedule> schedules, int? excludeClassId = null)
    {
        foreach (var newSchedule in schedules)
        {
            var existingSchedules = await _trainingClassRepository.GetSchedulesForCoachOnDayAsync(coachId, newSchedule.Day, excludeClassId);
            if (existingSchedules.Any(existing =>
                newSchedule.StartTime < existing.EndTime &&
                newSchedule.EndTime > existing.StartTime))
            {
                return true;
            }
        }
        return false;
    }

    private async Task EnsureNoCoachScheduleConflict(TrainingClass trainingClass)
    {
        if (await HasCoachScheduleConflictAsync(trainingClass.CoachId, trainingClass.Schedules, trainingClass.Id))
        {
            throw new InvalidOperationException("Coach is already assigned to another class at the same time.");
        }
    }

    public async Task<IEnumerable<TrainingClass>> GetAllAsync()
    {
        return await _trainingClassRepository.GetAllAsync();
    }

    public async Task<IEnumerable<TrainingClassDto>> GetClassesForCurrentCoachAsync()
    {
        var currentUser = await _currentUserService.GetCurrentUserAsync();
        if (currentUser == null || !currentUser.HasRole("Coach"))
            return Enumerable.Empty<TrainingClassDto>();

        var classes = await _trainingClassRepository.GetByCoachIdAsync(currentUser.Id);
        return _mapper.Map<IEnumerable<TrainingClassDto>>(classes);
    }
}
