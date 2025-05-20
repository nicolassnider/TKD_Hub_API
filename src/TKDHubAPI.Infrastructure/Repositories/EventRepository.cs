using Microsoft.EntityFrameworkCore;
using TKDHubAPI.Domain.Entities;
using TKDHubAPI.Domain.Repositories;
using TKDHubAPI.Infrastructure.Data;

namespace TKDHubAPI.Infrastructure.Repositories;
public class EventRepository : GenericRepository<Event>, IEventRepository
{
    private readonly TkdHubDbContext _context;

    public EventRepository(TkdHubDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Event>> GetEventsWithAttendanceAsync()
    {
        return await _context.Events
            .Include(e => e.EventAttendances)
            .ToListAsync();
    }

    public async Task<IEnumerable<Event>> GetEventsByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _context.Events
            .Where(e => e.StartDate >= startDate && e.EndDate <= endDate)
            .ToListAsync();
    }
}