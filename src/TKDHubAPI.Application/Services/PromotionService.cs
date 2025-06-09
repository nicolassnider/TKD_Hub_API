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

        // 1a. Check CoachId
        if (promotion.CoachId <= 0)
            throw new ArgumentException("CoachId must be provided and greater than zero.", nameof(promotion.CoachId));

        var coach = await _unitOfWork.Users.GetByIdAsync(promotion.CoachId);
        if (coach == null)
            throw new ArgumentException("Coach not found.", nameof(promotion.CoachId));

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

        // Validate that the provided rankId is the next rank
        if (promotion.RankId != nextRank.Id)
            throw new InvalidOperationException("Provided rankId does not match the next available rank for this student.");

        // Prevent duplicate promotion
        if (student.CurrentRankId == nextRank.Id)
            throw new InvalidOperationException("Student already has the next rank. Promotion not allowed.");

        // 4. Add promotion and update user's current rank
        student.CurrentRankId = nextRank.Id;

        // 5. If promoted to first black belt degree, add Coach role
        if (nextRank.DanLevel == 1 && !student.HasRole("Coach"))
        {
            await AddRoleToUserAsync(student, "Coach");
        }

        await _promotionRepository.AddAsync(promotion);
        _unitOfWork.Users.Update(student);
        await _unitOfWork.SaveChangesAsync();
    }

    // Helper method to add a role to a user if not already present
    private async Task AddRoleToUserAsync(User user, string roleName)
    {
        if (user.UserUserRoles == null)
            user.UserUserRoles = new List<UserUserRole>();

        // Check if the user already has the role
        if (!user.UserUserRoles.Any(uur => uur.UserRole.Name == roleName))
        {
            // Fetch the UserRole entity from the database/repository
            var userRole = await _unitOfWork.UserRoles.GetByNameAsync(roleName);
            if (userRole == null)
                throw new InvalidOperationException($"Role '{roleName}' does not exist.");

            user.UserUserRoles.Add(new UserUserRole { UserRole = userRole, UserRoleId = userRole.Id, UserId = user.Id });
        }
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
        // This will include Student, Rank, and Dojaang if your repository is set up correctly
        var promotion = await _promotionRepository.GetByIdAsync(id);
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
