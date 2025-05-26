namespace TKDHubAPI.Application.Interfaces;
public interface IPromotionService : ICrudService<Promotion>
{
    Task<IEnumerable<Promotion>> GetPromotionsByStudentIdAsync(int studentId);
    // Add other promotion-specific methods here if needed
}
