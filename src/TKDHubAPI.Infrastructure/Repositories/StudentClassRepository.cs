namespace TKDHubAPI.Infrastructure.Repositories;
public class StudentClassRepository : IStudentClassRepository
{
    private readonly TkdHubDbContext _context;

    public StudentClassRepository(TkdHubDbContext context)
    {
        _context = context;
    }

    public async Task<StudentClass> AddAsync(StudentClass entity)
    {
        var entry = await _context.StudentClasses.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entry.Entity;
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _context.StudentClasses.FindAsync(id);
        if (entity != null)
        {
            _context.StudentClasses.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<StudentClass> GetByIdAsync(int id)
    {
        return await _context.StudentClasses
            .Include(sc => sc.Student)
            .Include(sc => sc.TrainingClass)
            .FirstOrDefaultAsync(sc => sc.Id == id);
    }

    public async Task<IEnumerable<StudentClass>> GetByStudentIdAsync(int studentId)
    {
        return await _context.StudentClasses
            .Where(sc => sc.StudentId == studentId)
            .Include(sc => sc.TrainingClass)
            .ToListAsync();
    }

    public async Task<IEnumerable<StudentClass>> GetByTrainingClassIdAsync(int trainingClassId)
    {
        return await _context.StudentClasses
            .Where(sc => sc.TrainingClassId == trainingClassId)
            .Include(sc => sc.Student)
            .ToListAsync();
    }

    public async Task UpdateAsync(StudentClass entity)
    {
        _context.StudentClasses.Update(entity);
        await _context.SaveChangesAsync();
    }
}
