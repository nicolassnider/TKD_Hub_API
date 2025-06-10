namespace TKDHubAPI.Application.Services;

public class TrainingClassService : ITrainingClassService
{
    private readonly ITrainingClassRepository _trainingClassRepository;

    public TrainingClassService(ITrainingClassRepository trainingClassRepository)
    {
        _trainingClassRepository = trainingClassRepository;
    }

    public async Task<TrainingClass> CreateAsync(TrainingClass trainingClass)
    {
        return await _trainingClassRepository.AddAsync(trainingClass);
    }

    public async Task DeleteAsync(int id)
    {
        await _trainingClassRepository.DeleteAsync(id);
    }

    public async Task<IEnumerable<TrainingClass>> GetAllAsync()
    {
        return await _trainingClassRepository.GetAllAsync();
    }

    public async Task<TrainingClass> GetByIdAsync(int id)
    {
        return await _trainingClassRepository.GetByIdAsync(id);
    }

    public async Task UpdateAsync(TrainingClass trainingClass)
    {
        await _trainingClassRepository.UpdateAsync(trainingClass);
    }
}
