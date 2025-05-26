namespace TKDHubAPI.Application.Services;
public class TournamentService : ITournamentService
{
    private readonly ITournamentRepository _tournamentRepository;
    private readonly IUnitOfWork _unitOfWork;

    public TournamentService(ITournamentRepository tournamentRepository, IUnitOfWork unitOfWork)
    {
        _tournamentRepository = tournamentRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task AddAsync(Tournament tournament)
    {
        await _tournamentRepository.AddAsync(tournament);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var tournament = await _tournamentRepository.GetByIdAsync(id);
        if (tournament != null)
        {
            _tournamentRepository.Remove(tournament);
            await _unitOfWork.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<Tournament>> GetAllAsync()
    {
        return await _tournamentRepository.GetAllAsync();
    }

    public async Task<Tournament?> GetByIdAsync(int id)
    {
        return await _tournamentRepository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<Tournament>> GetTournamentsByCoachIdAsync(int coachId)
    {
        var all = await _tournamentRepository.GetAllAsync();
        return all.Where(t => t.Dojaang != null && t.Dojaang.CoachId == coachId);
    }

    public async Task<IEnumerable<Tournament>> GetTournamentsByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        var all = await _tournamentRepository.GetAllAsync();
        return all.Where(t => t.StartDate >= startDate && t.EndDate <= endDate);
    }

    public async Task<IEnumerable<Tournament>> GetTournamentsByDojaangIdAsync(int dojaangId)
    {
        var all = await _tournamentRepository.GetAllAsync();
        return all.Where(t => t.DojaangId == dojaangId);
    }

    public async Task<IEnumerable<Tournament>> GetTournamentsByLocationAsync(string location)
    {
        var all = await _tournamentRepository.GetAllAsync();
        return all.Where(t => t.Location != null && t.Location.Contains(location, StringComparison.OrdinalIgnoreCase));
    }

    public async Task<IEnumerable<Tournament>> GetTournamentsByNameAsync(string name)
    {
        var all = await _tournamentRepository.GetAllAsync();
        return all.Where(t => t.Name != null && t.Name.Contains(name, StringComparison.OrdinalIgnoreCase));
    }

    public async Task<IEnumerable<Tournament>> GetTournamentsByUserIdAsync(int userId)
    {
        var all = await _tournamentRepository.GetAllAsync();
        return all.Where(t => t.Registrations != null && t.Registrations.Any(r => r.StudentId == userId));
    }

    public async Task UpdateAsync(Tournament tournament)
    {
        _tournamentRepository.Update(tournament);
        await _unitOfWork.SaveChangesAsync();
    }
}
