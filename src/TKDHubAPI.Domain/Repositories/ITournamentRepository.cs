namespace TKDHubAPI.Domain.Repositories;
public interface ITournamentRepository : IGenericRepository<Tournament>
{
    Task<IEnumerable<Tournament>> GetUpcomingTournamentsAsync();
    Task<IEnumerable<Tournament>> GetTournamentsWithDetailsAsync();
}
