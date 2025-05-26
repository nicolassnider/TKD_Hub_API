namespace TKDHubAPI.Application.Services;
public class PromotionService : IPromotionService
{
    private readonly IPromotionRepository _promotionRepository;
    private readonly IUnitOfWork _unitOfWork;

    public PromotionService(IPromotionRepository promotionRepository, IUnitOfWork unitOfWork)
    {
        _promotionRepository = promotionRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task AddAsync(Promotion promotion)
    {
        await _promotionRepository.AddAsync(promotion);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var promotion = await _promotionRepository.GetByIdAsync(id);
        if (promotion != null)
        {
            _promotionRepository.Remove(promotion);
            await _unitOfWork.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<Promotion>> GetAllAsync()
    {
        return await _promotionRepository.GetAllAsync();
    }

    public async Task<Promotion?> GetByIdAsync(int id)
    {
        return await _promotionRepository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<Promotion>> GetPromotionsByStudentIdAsync(int studentId)
    {
        var all = await _promotionRepository.GetAllAsync();
        return all.Where(p => p.StudentId == studentId);
    }

    public async Task UpdateAsync(Promotion promotion)
    {
        _promotionRepository.Update(promotion);
        await _unitOfWork.SaveChangesAsync();
    }
}
