namespace TKDHubAPI.Infrastructure.Repositories;
public class TournamentRepository : GenericRepository<Tournament>, ITournamentRepository
{
    private readonly TkdHubDbContext _context;

    public TournamentRepository(TkdHubDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Tournament>> GetTournamentsWithDetailsAsync()
    {
        return await _context.Tournaments
           .Include(t => t.Registrations)
           .ToListAsync();
    }

    public async Task<IEnumerable<Tournament>> GetUpcomingTournamentsAsync()
    {
        return await _context.Tournaments
            .Where(t => t.StartDate > DateTime.Now)
            .ToListAsync();
    }
}

