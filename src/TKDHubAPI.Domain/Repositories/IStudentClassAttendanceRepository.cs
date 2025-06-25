namespace TKDHubAPI.Domain.Repositories;
public interface IStudentClassAttendanceRepository
{
    Task<StudentClassAttendance?> GetByIdAsync(int id);
    Task<IEnumerable<StudentClassAttendance>> GetByStudentClassIdAsync(int studentClassId);
    Task<IEnumerable<StudentClassAttendance>> GetByDateRangeAsync(DateTime from, DateTime to, int? studentClassId = null);
    Task AddAsync(StudentClassAttendance attendance);
    Task UpdateAsync(StudentClassAttendance attendance);
    Task DeleteAsync(int id);
}
