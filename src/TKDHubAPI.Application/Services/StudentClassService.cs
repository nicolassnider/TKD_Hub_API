namespace TKDHubAPI.Application.Services;


public class StudentClassService : IStudentClassService
{
    private readonly IStudentClassRepository _studentClassRepository;
    private readonly IStudentClassAttendanceRepository _attendanceRepository;


    public StudentClassService(
        IStudentClassRepository studentClassRepository,
        IStudentClassAttendanceRepository attendanceRepository)
    {
        _studentClassRepository = studentClassRepository;
        _attendanceRepository = attendanceRepository;
    }


    public async Task<StudentClass> CreateAsync(StudentClass studentClass)
    {
        return await _studentClassRepository.AddAsync(studentClass);
    }


    public async Task DeleteAsync(int id)
    {
        await _studentClassRepository.DeleteAsync(id);
    }


    public async Task<StudentClass> GetByIdAsync(int id)
    {
        return await _studentClassRepository.GetByIdAsync(id);
    }


    public async Task<IEnumerable<StudentClass>> GetByStudentIdAsync(int studentId)
    {
        var classes = await _studentClassRepository.GetByStudentIdAsync(studentId);
        return classes.OrderByDescending(sc => sc.Date);
    }


    public async Task<IEnumerable<StudentClass>> GetByTrainingClassIdAsync(int trainingClassId)
    {
        return await _studentClassRepository.GetByTrainingClassIdAsync(trainingClassId);
    }


    public async Task UpdateAsync(StudentClass studentClass)
    {
        await _studentClassRepository.UpdateAsync(studentClass);
    }


    public async Task<IEnumerable<User>> GetStudentsByTrainingClassIdAsync(int trainingClassId)
    {
        var studentClasses = await _studentClassRepository.GetByTrainingClassIdAsync(trainingClassId);
        // Select the Student property from each StudentClass, filter out nulls, and return distinct students
        return studentClasses
            .Where(sc => sc.Student != null)
            .Select(sc => sc.Student)
            .Distinct()
            .ToList();
    }


    // --- Attendance Management ---


    /// <summary>
    /// Registers an attendance event for a student in a class.
    /// </summary>
    public async Task RegisterAttendanceAsync(int studentClassId, DateTime attendedAt, AttendanceStatus status, string? notes = null)
    {
        var studentClass = await _studentClassRepository.GetByIdAsync(studentClassId);
        if (studentClass == null)
            throw new Exception("StudentClass relationship not found.");


        var attendance = new StudentClassAttendance
        {
            StudentClassId = studentClassId,
            AttendedAt = attendedAt,
            Status = status,
            Notes = notes
        };


        await _attendanceRepository.AddAsync(attendance);
    }


    /// <summary>
    /// Gets attendance records for a student in a class, optionally filtered by date range.
    /// </summary>
    public async Task<IEnumerable<StudentClassAttendance>> GetAttendanceHistoryAsync(int studentClassId, DateTime? from = null, DateTime? to = null)
    {
        if (from.HasValue && to.HasValue)
        {
            return await _attendanceRepository.GetByDateRangeAsync(from.Value, to.Value, studentClassId);
        }
        return await _attendanceRepository.GetByStudentClassIdAsync(studentClassId);
    }
}





