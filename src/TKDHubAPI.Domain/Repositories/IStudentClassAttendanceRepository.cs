namespace TKDHubAPI.Domain.Repositories;

public interface IStudentClassAttendanceRepository
{
    // Legacy signatures (no CancellationToken) kept for compatibility with existing callers/tests
    Task<StudentClassAttendance?> GetByIdAsync(int id);
    Task<IEnumerable<StudentClassAttendance>> GetByStudentClassIdAsync(int studentClassId);
    Task<IEnumerable<StudentClassAttendance>> GetByDateRangeAsync(DateTime from, DateTime to, int? studentClassId = null);
    Task AddAsync(StudentClassAttendance attendance);
    Task UpdateAsync(StudentClassAttendance attendance);
    Task DeleteAsync(int id);

    // New signatures with CancellationToken for better async cancellation support
    Task<StudentClassAttendance?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IEnumerable<StudentClassAttendance>> GetByStudentClassIdAsync(int studentClassId, CancellationToken cancellationToken = default);
    Task<IEnumerable<StudentClassAttendance>> GetByDateRangeAsync(DateTime from, DateTime to, int? studentClassId = null, CancellationToken cancellationToken = default);
    Task AddAsync(StudentClassAttendance attendance, CancellationToken cancellationToken = default);
    Task UpdateAsync(StudentClassAttendance attendance, CancellationToken cancellationToken = default);
    Task DeleteAsync(int id, CancellationToken cancellationToken = default);
}
