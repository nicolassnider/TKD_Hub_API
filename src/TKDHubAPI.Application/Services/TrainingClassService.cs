﻿using TKDHubAPI.Application.DTOs.TrainingClass;

namespace TKDHubAPI.Application.Services;

public class TrainingClassService : ITrainingClassService
{
    private readonly ITrainingClassRepository _trainingClassRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IStudentClassAttendanceRepository _attendanceRepository;

    public TrainingClassService(
        ITrainingClassRepository trainingClassRepository,
        ICurrentUserService currentUserService,
        IMapper mapper,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        IStudentClassAttendanceRepository attendanceRepository)
    {
        _trainingClassRepository = trainingClassRepository;
        _currentUserService = currentUserService;
        _mapper = mapper;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _attendanceRepository = attendanceRepository;
    }

    public async Task<TrainingClass> CreateAsync(TrainingClass trainingClass)
    {
        // Check for coach schedule conflicts
        await EnsureNoCoachScheduleConflict(trainingClass);

        return await _trainingClassRepository.AddAsync(trainingClass);
    }

    public async Task UpdateAsync(TrainingClass trainingClass)
    {
        // Check for coach schedule conflicts
        await EnsureNoCoachScheduleConflict(trainingClass);

        await _trainingClassRepository.UpdateAsync(trainingClass);
    }

    public async Task DeleteAsync(int id)
    {
        await _trainingClassRepository.DeleteAsync(id);
    }

    public async Task<IEnumerable<TrainingClass>> DeleteAsync()
    {
        return await _trainingClassRepository.GetAllAsync();
    }

    public async Task<TrainingClass> GetByIdAsync(int id)
    {
        return await _trainingClassRepository.GetByIdAsync(id);
    }

    public async Task<bool> HasCoachScheduleConflictAsync(int coachId, IEnumerable<ClassSchedule> schedules, int? excludeClassId = null)
    {
        foreach (var newSchedule in schedules)
        {
            var existingSchedules = await _trainingClassRepository.GetSchedulesForCoachOnDayAsync(coachId, newSchedule.Day, excludeClassId);
            if (existingSchedules.Any(existing =>
                newSchedule.StartTime < existing.EndTime &&
                newSchedule.EndTime > existing.StartTime))
            {
                return true;
            }
        }
        return false;
    }

    private async Task EnsureNoCoachScheduleConflict(TrainingClass trainingClass)
    {
        if (await HasCoachScheduleConflictAsync(trainingClass.CoachId, trainingClass.Schedules, trainingClass.Id))
        {
            throw new InvalidOperationException("Coach is already assigned to another class at the same time.");
        }
    }

    public async Task<IEnumerable<TrainingClass>> GetAllAsync()
    {
        return await _trainingClassRepository.GetAllAsync();
    }

    public async Task<IEnumerable<TrainingClassDto>> GetClassesForCurrentCoachAsync()
    {
        var currentUser = await _currentUserService.GetCurrentUserAsync();
        if (currentUser == null || !currentUser.HasRole("Coach"))
            return Enumerable.Empty<TrainingClassDto>();

        var classes = await _trainingClassRepository.GetByCoachIdAsync(currentUser.Id);
        return _mapper.Map<IEnumerable<TrainingClassDto>>(classes);
    }

    public async Task AddStudentToClassAsync(int trainingClassId, int studentId)
    {
        var trainingClass = await _trainingClassRepository.GetByIdAsync(trainingClassId);
        if (trainingClass == null)
            throw new Exception("Training class not found.");

        var student = await _userRepository.GetByIdAsync(studentId);
        if (student == null)
            throw new Exception("Student not found.");

        // Prevent duplicates
        if (trainingClass.StudentClasses.Any(sc => sc.StudentId == studentId))
            throw new InvalidOperationException("Student is already enrolled in this class.");

        trainingClass.StudentClasses.Add(new StudentClass
        {
            StudentId = studentId,
            TrainingClassId = trainingClassId
        });

        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<IEnumerable<TrainingClass>> GetByCoachIdAsync(int coachId)
    {
        return await _trainingClassRepository.GetByCoachIdAsync(coachId);
    }

    public async Task RegisterAttendanceAsync(int studentClassId, DateTime attendedAt, AttendanceStatus status, string? notes = null)
    {
        // Optionally, validate that the studentClassId exists
        var studentClass = await _unitOfWork
            .StudentClasses
            .GetByIdAsync(studentClassId);

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

    public async Task<IEnumerable<StudentClassAttendance>> GetAttendanceHistoryAsync(int studentClassId, DateTime? from = null, DateTime? to = null)
    {
        if (from.HasValue && to.HasValue)
        {
            return await _attendanceRepository.GetByDateRangeAsync(from.Value, to.Value, studentClassId);
        }
        return await _attendanceRepository.GetByStudentClassIdAsync(studentClassId);
    }
}
