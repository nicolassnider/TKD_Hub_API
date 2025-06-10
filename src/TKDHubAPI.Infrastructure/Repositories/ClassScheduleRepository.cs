namespace TKDHubAPI.Infrastructure.Repositories;
public class ClassScheduleRepository : IClassScheduleRepository
{
    private readonly TkdHubDbContext _context;

    public ClassScheduleRepository(TkdHubDbContext context)
    {
        _context = context;
    }

    public async Task<ClassSchedule> AddAsync(ClassSchedule entity)
    {
        var entry = await _context.ClassSchedules.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entry.Entity;
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _context.ClassSchedules.FindAsync(id);
        if (entity != null)
        {
            _context.ClassSchedules.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<ClassSchedule> GetByIdAsync(int id)
    {
        return await _context.ClassSchedules
            .Include(cs => cs.TrainingClass)
            .FirstOrDefaultAsync(cs => cs.Id == id);
    }

    public async Task<IEnumerable<ClassSchedule>> GetByTrainingClassIdAsync(int trainingClassId)
    {
        return await _context.ClassSchedules
            .Where(cs => cs.TrainingClassId == trainingClassId)
            .Include(cs => cs.TrainingClass)
            .ToListAsync();
    }

    public async Task UpdateAsync(ClassSchedule entity)
    {
        _context.ClassSchedules.Update(entity);
        await _context.SaveChangesAsync();
    }
}

