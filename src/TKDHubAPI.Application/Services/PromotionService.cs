namespace TKDHubAPI.Application.Services;

public class PromotionService : IPromotionService
{
    private readonly IPromotionRepository _promotionRepository;
    private readonly IUnitOfWork _unitOfWork;

    public PromotionService(IPromotionRepository promotionRepository, IUnitOfWork unitOfWork)
    {
        _promotionRepository = promotionRepository ?? throw new ArgumentNullException(nameof(promotionRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
    }

    public async Task AddAsync(Promotion promotion)
    {
        if (promotion == null)
            throw new ArgumentNullException(nameof(promotion));

        // 1. Get the student
        var student = await _unitOfWork.Users.GetByIdAsync(promotion.StudentId);
        if (student == null)
            throw new ArgumentException("Student not found.", nameof(promotion.StudentId));

        // 2. Get all ranks ordered by 'Order'
        var allRanks = (await _unitOfWork.Ranks.GetAllAsync()).OrderBy(r => r.Order).ToList();

        // 3. Find current and next rank
        var currentRankId = student.CurrentRankId;
        var currentRankIndex = allRanks.FindIndex(r => r.Id == currentRankId);
        var nextRank = (currentRankIndex >= 0 && currentRankIndex + 1 < allRanks.Count)
            ? allRanks[currentRankIndex + 1]
            : null;

        if (nextRank == null)
            throw new InvalidOperationException("No next rank available for promotion.");

        // Enforce: Only allow promotion to the next rank
        promotion.RankId = nextRank.Id;

        // 4. Add promotion and update user's current rank
        student.CurrentRankId = nextRank.Id;
        await _promotionRepository.AddAsync(promotion);
        _unitOfWork.Users.Update(student);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var promotion = await _promotionRepository.GetByIdAsync(id);
        if (promotion == null)
            return;

        _promotionRepository.Remove(promotion);
        await _unitOfWork.SaveChangesAsync();
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
        if (promotion == null)
            throw new ArgumentNullException(nameof(promotion));

        _promotionRepository.Update(promotion);
        await _unitOfWork.SaveChangesAsync();
    }
}
