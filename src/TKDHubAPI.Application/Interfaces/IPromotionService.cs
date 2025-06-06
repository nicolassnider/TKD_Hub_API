namespace TKDHubAPI.Application.Interfaces;

/// <summary>
/// Provides CRUD operations and domain-specific methods for managing Promotion entities, including retrieving promotions by student.
/// </summary>
public interface IPromotionService : ICrudService<Promotion>
{
    /// <summary>
    /// Retrieves a list of promotions associated with a specific student asynchronously.
    /// </summary>
    /// <param name="studentId">The identifier of the student whose promotions are to be retrieved.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of Promotions associated with the student.</returns>
    Task<IEnumerable<Promotion>> GetPromotionsByStudentIdAsync(int studentId);
}

