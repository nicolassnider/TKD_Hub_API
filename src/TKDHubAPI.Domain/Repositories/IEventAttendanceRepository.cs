namespace TKDHubAPI.Domain.Repositories;

/// <summary>
/// Provides repository operations for EventAttendance entities, including retrieval by event, student, and attendance details.
/// </summary>
public interface IEventAttendanceRepository : IGenericRepository<EventAttendance>
{
    /// <summary>
    /// Retrieves a collection of event attendance records associated with a specific event asynchronously.
    /// </summary>
    /// <param name="eventId">The identifier of the event for which to retrieve attendance records.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of EventAttendance for the specified event.</returns>
    Task<IEnumerable<EventAttendance>> GetEventAttendanceByEventIdAsync(int eventId);

    /// <summary>
    /// Retrieves a collection of event attendance records associated with a specific student asynchronously.
    /// </summary>
    /// <param name="studentId">The identifier of the student for which to retrieve attendance records.</param>
    /// <returns>A task that represents the asynchronous operation, containing a collection of EventAttendance for the specified student.</returns>
    Task<IEnumerable<EventAttendance>> GetEventAttendanceByStudentIdAsync(int studentId);

    /// <summary>
    /// Retrieves the details of a specific event attendance record by its identifier asynchronously.
    /// </summary>
    /// <param name="id">The identifier of the event attendance record to retrieve.</param>
    /// <returns>A task that represents the asynchronous operation, containing the EventAttendance details if found; otherwise, null.</returns>
    Task<EventAttendance> GetEventAttendanceDetailsAsync(int id);
}
