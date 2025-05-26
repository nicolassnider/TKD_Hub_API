namespace TKDHubAPI.Application.Interfaces;
public interface ITournamentService : ICrudService<Tournament>
{
    Task<IEnumerable<Tournament>> GetTournamentsByDojaangIdAsync(int dojaangId);
    Task<IEnumerable<Tournament>> GetTournamentsByUserIdAsync(int userId);
    Task<IEnumerable<Tournament>> GetTournamentsByCoachIdAsync(int coachId);
    Task<IEnumerable<Tournament>> GetTournamentsByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<IEnumerable<Tournament>> GetTournamentsByLocationAsync(string location);
    Task<IEnumerable<Tournament>> GetTournamentsByNameAsync(string name);

}