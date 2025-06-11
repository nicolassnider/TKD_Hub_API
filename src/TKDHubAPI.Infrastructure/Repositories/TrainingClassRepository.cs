namespace TKDHubAPI.Infrastructure.Repositories;
public class TrainingClassRepository : ITrainingClassRepository
{
    private readonly TkdHubDbContext _context;

    public TrainingClassRepository(TkdHubDbContext context)
    {
        _context = context;
    }

    public async Task<TrainingClass> AddAsync(TrainingClass entity)
    {
        var entry = await _context.TrainingClasses.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entry.Entity;
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _context.TrainingClasses.FindAsync(id);
        if (entity != null)
        {
            _context.TrainingClasses.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<TrainingClass>> GetAllAsync()
    {
        return await _context.TrainingClasses
            .Include(tc => tc.Dojaang)
            .Include(tc => tc.Coach)
            .Include(tc => tc.Schedules)
            .Include(tc => tc.StudentClasses)
            .ToListAsync();
    }

    public async Task<TrainingClass> GetByIdAsync(int id)
    {
        return await _context.TrainingClasses
            .Include(tc => tc.Dojaang)
            .Include(tc => tc.Coach)
            .Include(tc => tc.Schedules)
            .Include(tc => tc.StudentClasses)
            .FirstOrDefaultAsync(tc => tc.Id == id);
    }

    public async Task UpdateAsync(TrainingClass entity)
    {
        _context.TrainingClasses.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<ClassSchedule>> GetSchedulesForCoachOnDayAsync(int coachId, DayOfWeek day, int? excludeClassId = null)
    {
        return await _context.ClassSchedules
            .Where(s =>
                s.TrainingClass.Coach.Id == coachId &&
                s.Day == day &&
                (excludeClassId == null || s.TrainingClassId != excludeClassId))
            .ToListAsync();
    }
}
