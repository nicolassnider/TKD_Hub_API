namespace TKDHubAPI.Application.Services;
public class TulService : ITulService // Corrected base class to TulService
{
    private readonly ITulRepository _tulRepository;
    private readonly IUnitOfWork _unitOfWork;

    public TulService(ITulRepository tulRepository, IUnitOfWork unitOfWork)  // Corrected constructor parameter type
    {
        _tulRepository = tulRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<Tul>> GetAllAsync()
    {
        return await _tulRepository.GetAllAsync();
    }

    public async Task<Tul?> GetByIdAsync(int id)
    {
        return await _tulRepository.GetByIdAsync(id);
    }

    public async Task AddAsync(Tul tul)
    {
        await _tulRepository.AddAsync(tul);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task UpdateAsync(Tul tul)
    {
        _tulRepository.Update(tul);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var tul = await _tulRepository.GetByIdAsync(id);
        if (tul != null)
        {
            _tulRepository.Remove(tul);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
