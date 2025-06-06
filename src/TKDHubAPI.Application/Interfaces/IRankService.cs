namespace TKDHubAPI.Application.Interfaces;

/// <summary>
/// Defines a contract for managing ranks asynchronously, including operations to retrieve ranks by color, order, Dan level, stripe color, description, name, dojaang, user, coach, rank type, date range, and location.
/// </summary>
public interface IRankService : ICrudService<Rank>
{
    /// <summary>
    /// Retrieves a list of ranks associated with a specific belt color asynchronously.
    /// </summary>
    /// <param name="color">The belt color to filter ranks.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of Ranks associated with the specified color.</returns>
    Task<IEnumerable<Rank>> GetRanksByColorAsync(BeltColor color);

    /// <summary>
    /// Retrieves a list of ranks ordered by their rank order asynchronously.
    /// </summary>
    /// <param name="order">The order to filter ranks.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of Ranks ordered by the specified order.</returns>
    Task<IEnumerable<Rank>> GetRanksByOrderAsync(int order);

    /// <summary>
    /// Retrieves a list of ranks associated with a specific Dan level asynchronously.
    /// </summary>
    /// <param name="danLevel">The Dan level to filter ranks.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of Ranks associated with the specified Dan level.</returns>
    Task<IEnumerable<Rank>> GetRanksByDanLevelAsync(int danLevel);

    /// <summary>
    /// Retrieves a list of ranks associated with a specific stripe color asynchronously.
    /// </summary>
    /// <param name="stripeColor">The stripe color to filter ranks.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of Ranks associated with the specified stripe color.</returns>
    Task<IEnumerable<Rank>> GetRanksByStripeColorAsync(BeltColor stripeColor);

    /// <summary>
    /// Retrieves a list of ranks that match a specific description asynchronously.
    /// </summary>
    /// <param name="description">The description to filter ranks.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of Ranks that match the specified description.</returns>
    Task<IEnumerable<Rank>> GetRanksByDescriptionAsync(string description);

    /// <summary>
    /// Retrieves a list of ranks that match a specific name asynchronously.
    /// </summary>
    /// <param name="name">The name to filter ranks.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of Ranks that match the specified name.</returns>
    Task<IEnumerable<Rank>> GetRanksByNameAsync(string name);

    /// <summary>
    /// Retrieves a list of ranks associated with a specific dojaang asynchronously.
    /// </summary>
    /// <param name="dojaangId">The identifier of the dojaang to filter ranks.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of Ranks associated with the specified dojaang.</returns>
    Task<IEnumerable<Rank>> GetRanksByDojaangIdAsync(int dojaangId);

    /// <summary>
    /// Retrieves a list of ranks associated with a specific user asynchronously.
    /// </summary>
    /// <param name="userId">The identifier of the user to filter ranks.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of Ranks associated with the specified user.</returns>
    Task<IEnumerable<Rank>> GetRanksByUserIdAsync(int userId);

    /// <summary>
    /// Retrieves a list of ranks associated with a specific coach asynchronously.
    /// </summary>
    /// <param name="coachId">The identifier of the coach to filter ranks.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of Ranks associated with the specified coach.</returns>
    Task<IEnumerable<Rank>> GetRanksByCoachIdAsync(int coachId);

    /// <summary>
    /// Retrieves a list of ranks associated with a specific rank type asynchronously.
    /// </summary>
    /// <param name="rankType">The rank type to filter ranks.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of Ranks associated with the specified rank type.</returns>
    Task<IEnumerable<Rank>> GetRanksByTypeAsync(BeltColor rankType);

    /// <summary>
    /// Retrieves a list of ranks that fall within a specific date range asynchronously.
    /// </summary>
    /// <param name="startDate">The start date of the range.</param>
    /// <param name="endDate">The end date of the range.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of Ranks that fall within the specified date range.</returns>
    Task<IEnumerable<Rank>> GetRanksByDateRangeAsync(DateTime startDate, DateTime endDate);

    /// <summary>
    /// Retrieves a list of ranks associated with a specific location asynchronously.
    /// </summary>
    /// <param name="location">The location to filter ranks.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of Ranks associated with the specified location.</returns>
    Task<IEnumerable<Rank>> GetRanksByLocationAsync(string location);
}
