namespace TKDHubAPI.Infrastructure.Repositories;
public class EventAttendanceRepository : GenericRepository<EventAttendance>, IEventAttendanceRepository
{
    private readonly TkdHubDbContext _context;

    public EventAttendanceRepository(TkdHubDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<IEnumerable<EventAttendance>> GetEventAttendanceByEventIdAsync(int eventId)
    {
        return await _context.EventAttendances
            .Where(ea => ea.EventId == eventId)
            .Include(ea => ea.Student) // Include student details
            .ToListAsync();
    }

    public async Task<IEnumerable<EventAttendance>> GetEventAttendanceByStudentIdAsync(int studentId)
    {
        return await _context.EventAttendances
           .Where(ea => ea.StudentId == studentId)
           .Include(ea => ea.Event)
           .ToListAsync();
    }

    public async Task<EventAttendance> GetEventAttendanceDetailsAsync(int id)
    {
        return await _context.EventAttendances
            .Include(ea => ea.Event)
            .Include(ea => ea.Student)
            .FirstOrDefaultAsync(ea => ea.Id == id);
    }
}
