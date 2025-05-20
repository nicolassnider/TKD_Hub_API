using TKDHubAPI.Domain.Entities;

namespace TKDHubAPI.Domain.Repositories;
public interface IEventAttendanceRepository : IGenericRepository<EventAttendance>
{
    Task<IEnumerable<EventAttendance>> GetEventAttendanceByEventIdAsync(int eventId);
    Task<IEnumerable<EventAttendance>> GetEventAttendanceByStudentIdAsync(int studentId);
    Task<EventAttendance> GetEventAttendanceDetailsAsync(int id);
}
