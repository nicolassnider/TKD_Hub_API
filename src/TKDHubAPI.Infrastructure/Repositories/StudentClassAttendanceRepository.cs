namespace TKDHubAPI.Infrastructure.Repositories;

/// <summary>
/// Repository for managing student class attendance records. Methods add/update/delete only touch the DbContext; caller is responsible for saving changes.
/// </summary>
public class StudentClassAttendanceRepository : IStudentClassAttendanceRepository
{
    private readonly TkdHubDbContext _context;

    public StudentClassAttendanceRepository(TkdHubDbContext context)
    {
        _context = context;
    }

    /// <inheritdoc/>
    public async Task<StudentClassAttendance?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.StudentClassAttendances
            .Include(a => a.StudentClass)
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
    }

    /// <inheritdoc/>
    public Task<StudentClassAttendance?> GetByIdAsync(int id) => GetByIdAsync(id, CancellationToken.None);

    /// <inheritdoc/>
    public async Task<IEnumerable<StudentClassAttendance>> GetByStudentClassIdAsync(int studentClassId, CancellationToken cancellationToken = default)
    {
        return await _context.StudentClassAttendances
            .Where(a => a.StudentClassId == studentClassId)
            .ToListAsync(cancellationToken);
    }

    /// <inheritdoc/>
    public Task<IEnumerable<StudentClassAttendance>> GetByStudentClassIdAsync(int studentClassId) => GetByStudentClassIdAsync(studentClassId, CancellationToken.None);

    /// <inheritdoc/>
    public async Task<IEnumerable<StudentClassAttendance>> GetByDateRangeAsync(DateTime from, DateTime to, int? studentClassId = null, CancellationToken cancellationToken = default)
    {
        var query = _context.StudentClassAttendances
            .Where(a => a.AttendedAt >= from && a.AttendedAt <= to);

        if (studentClassId.HasValue)
            query = query.Where(a => a.StudentClassId == studentClassId.Value);

        return await query.ToListAsync(cancellationToken);
    }

    /// <inheritdoc/>
    public Task<IEnumerable<StudentClassAttendance>> GetByDateRangeAsync(DateTime from, DateTime to, int? studentClassId = null) => GetByDateRangeAsync(from, to, studentClassId, CancellationToken.None);

    /// <inheritdoc/>
    public async Task AddAsync(StudentClassAttendance attendance, CancellationToken cancellationToken = default)
    {
        await _context.StudentClassAttendances.AddAsync(attendance, cancellationToken);
    }

    /// <inheritdoc/>
    public Task AddAsync(StudentClassAttendance attendance) => AddAsync(attendance, CancellationToken.None);

    /// <inheritdoc/>
    public Task UpdateAsync(StudentClassAttendance attendance, CancellationToken cancellationToken = default)
    {
        _context.StudentClassAttendances.Update(attendance);
        return Task.CompletedTask;
    }

    /// <inheritdoc/>
    public Task UpdateAsync(StudentClassAttendance attendance) => UpdateAsync(attendance, CancellationToken.None);

    /// <inheritdoc/>
    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.StudentClassAttendances.FindAsync(new object[] { id }, cancellationToken);
        if (entity != null)
            _context.StudentClassAttendances.Remove(entity);
    }

    /// <inheritdoc/>
    public Task DeleteAsync(int id) => DeleteAsync(id, CancellationToken.None);
}
