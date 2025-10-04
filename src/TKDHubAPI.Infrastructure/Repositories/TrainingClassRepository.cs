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

    public async Task<IEnumerable<TrainingClass>> GetByCoachIdAsync(int coachId)
    {
        return await _context.TrainingClasses
            .Include(tc => tc.Schedules)
            .Include(tc => tc.Coach)
            .Include(tc => tc.Dojaang)
            .Where(tc => tc.CoachId == coachId)
            .ToListAsync();
    }

    public async Task<int> CountAsync()
    {
        return await _context.TrainingClasses.CountAsync();
    }

    public async Task<IEnumerable<TrainingClass>> GetRecentAsync(int count)
    {
        return await _context.TrainingClasses
            .Include(tc => tc.Dojaang)
            .Include(tc => tc.Coach)
            .OrderByDescending(tc => tc.Id) // Use Id as proxy for creation order
            .Take(count)
            .ToListAsync();
    }

    public async Task<IEnumerable<TrainingClass>> GetUpcomingAsync(int count)
    {
        var today = DateTime.Today;
        var currentTime = TimeOnly.FromDateTime(DateTime.Now);
        var currentDayOfWeek = (DayOfWeek)today.DayOfWeek;

        return await _context.TrainingClasses
            .Include(tc => tc.Schedules)
            .Include(tc => tc.Dojaang)
            .Include(tc => tc.Coach)
            .Where(tc => tc.Schedules.Any(s =>
                s.Day > currentDayOfWeek ||
                (s.Day == currentDayOfWeek && s.StartTime > currentTime)))
            .OrderBy(tc => tc.Schedules.Min(s => s.StartTime))
            .Take(count)
            .ToListAsync();
    }

    public async Task<object> GetStatisticsAsync()
    {
        var totalClasses = await _context.TrainingClasses.CountAsync();
        var totalStudents = await _context.StudentClasses
            .Select(sc => sc.StudentId)
            .Distinct()
            .CountAsync();

        return new
        {
            TotalClasses = totalClasses,
            ActiveClasses = totalClasses, // Assuming all are active since no IsActive property
            TotalEnrolledStudents = totalStudents,
            AverageStudentsPerClass = totalClasses > 0 ? (double)totalStudents / totalClasses : 0,
        };
    }
}
