namespace TKDHubAPI.Infrastructure.Repositories;


public class StudentClassAttendanceRepository : IStudentClassAttendanceRepository
{
    private readonly TkdHubDbContext _context;


    public StudentClassAttendanceRepository(TkdHubDbContext context)
    {
        _context = context;
    }


    public async Task<StudentClassAttendance?> GetByIdAsync(int id)
    {
        return await _context.StudentClassAttendances
            .Include(a => a.StudentClass)
            .FirstOrDefaultAsync(a => a.Id == id);
    }


    public async Task<IEnumerable<StudentClassAttendance>> GetByStudentClassIdAsync(int studentClassId)
    {
        return await _context.StudentClassAttendances
            .Where(a => a.StudentClassId == studentClassId)
            .ToListAsync();
    }


    public async Task<IEnumerable<StudentClassAttendance>> GetByDateRangeAsync(DateTime from, DateTime to, int? studentClassId = null)
    {
        var query = _context.StudentClassAttendances
            .Where(a => a.AttendedAt >= from && a.AttendedAt <= to);


        if (studentClassId.HasValue)
            query = query.Where(a => a.StudentClassId == studentClassId.Value);


        return await query.ToListAsync();
    }


    public async Task AddAsync(StudentClassAttendance attendance)
    {
        // Add to context, but do not call SaveChanges here. UnitOfWork / service layer should persist.
        await _context.StudentClassAttendances.AddAsync(attendance);
    }


    public Task UpdateAsync(StudentClassAttendance attendance)
    {
        _context.StudentClassAttendances.Update(attendance);
        return Task.CompletedTask;
    }


    public async Task DeleteAsync(int id)
    {
        var entity = await _context.StudentClassAttendances.FindAsync(id);
        if (entity != null)
        {
            _context.StudentClassAttendances.Remove(entity);
        }
    }
}
