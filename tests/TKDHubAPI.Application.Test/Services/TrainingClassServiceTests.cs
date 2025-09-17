using TKDHubAPI.Application.DTOs.TrainingClass;
using TKDHubAPI.Domain.Enums;

namespace TKDHubAPI.Application.Test.Services;

public class TrainingClassServiceTests : BaseServiceTest<TrainingClassService, ITrainingClassRepository>
{
    private static Mock<ICurrentUserService> _currentUserServiceMock = new();
    private static Mock<IMapper> _mapperMock = new();
    private static Mock<IUserRepository> _userRepositoryMock = new();
    private static Mock<IUnitOfWork> _unitOfWorkMock = new();
    private static Mock<IStudentClassAttendanceRepository> _StudentClassAttendanceRepositoryMock = new();

    public TrainingClassServiceTests()
        : base(repoMock =>
            new TrainingClassService(
                repoMock.Object,
                _currentUserServiceMock.Object,
                _mapperMock.Object,
                _userRepositoryMock.Object,
                _unitOfWorkMock.Object,
                _StudentClassAttendanceRepositoryMock.Object))
    {
    }

    #region CreateAsync

    [Fact]
    public async Task CreateAsync_ShouldThrow_WhenCoachHasScheduleConflict()
    {
        // Arrange
        var coachId = 1;
        var newSchedule = new ClassSchedule
        {
            Day = DayOfWeek.Monday,
            StartTime = new TimeOnly(10, 30),
            EndTime = new TimeOnly(11, 30)
        };
        var existingSchedule = new ClassSchedule
        {
            Day = DayOfWeek.Monday,
            StartTime = new TimeOnly(10, 0),
            EndTime = new TimeOnly(11, 0)
        };

        RepoMock.Setup(r => r.GetSchedulesForCoachOnDayAsync(coachId, DayOfWeek.Monday, It.IsAny<int?>()))
            .ReturnsAsync(new List<ClassSchedule> { existingSchedule });

        var newClass = new TrainingClass
        {
            CoachId = coachId,
            Schedules = new List<ClassSchedule> { newSchedule }
        };

        // Act
        Func<Task> act = async () => await Service.CreateAsync(newClass);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Coach is already assigned to another class at the same time.");
    }

    [Fact]
    public async Task CreateAsync_ShouldSucceed_WhenNoScheduleConflict()
    {
        // Arrange
        var coachId = 1;
        var existingSchedule = new ClassSchedule
        {
            Day = DayOfWeek.Monday,
            StartTime = new TimeOnly(8, 0),
            EndTime = new TimeOnly(9, 0)
        };
        var existingClass = new TrainingClass
        {
            Id = 2,
            CoachId = coachId,
            Schedules = new List<ClassSchedule> { existingSchedule }
        };
        RepoMock.Setup(r => r.GetAllAsync())
            .ReturnsAsync(new List<TrainingClass> { existingClass });

        var newClass = new TrainingClass
        {
            CoachId = coachId,
            Schedules = new List<ClassSchedule>
            {
                new ClassSchedule
                {
                    Day = DayOfWeek.Monday,
                    StartTime = new TimeOnly(9, 30),
                    EndTime = new TimeOnly(10, 30)
                }
            }
        };

        RepoMock.Setup(r => r.AddAsync(It.IsAny<TrainingClass>()))
            .ReturnsAsync(newClass);

        // Act
        var result = await Service.CreateAsync(newClass);

        // Assert
        result.Should().Be(newClass);
    }

    #endregion

    #region UpdateAsync

    [Fact]
    public async Task UpdateAsync_ShouldThrow_WhenCoachHasScheduleConflict()
    {
        // Arrange
        var coachId = 1;
        var classId = 10;
        var existingSchedule = new ClassSchedule
        {
            Day = DayOfWeek.Monday,
            StartTime = new TimeOnly(10, 0),
            EndTime = new TimeOnly(11, 0)
        };

        RepoMock.Setup(r => r.GetSchedulesForCoachOnDayAsync(coachId, DayOfWeek.Monday, classId))
            .ReturnsAsync(new List<ClassSchedule> { existingSchedule });

        var updatedClass = new TrainingClass
        {
            Id = classId,
            CoachId = coachId,
            Schedules = new List<ClassSchedule>
            {
                new ClassSchedule
                {
                    Day = DayOfWeek.Monday,
                    StartTime = new TimeOnly(10, 30),
                    EndTime = new TimeOnly(11, 30)
                }
            }
        };

        // Act
        Func<Task> act = async () => await Service.UpdateAsync(updatedClass);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Coach is already assigned to another class at the same time.");
    }

    [Fact]
    public async Task UpdateAsync_ShouldSucceed_WhenNoScheduleConflict()
    {
        // Arrange
        var coachId = 1;
        var classId = 10;
        var existingSchedule = new ClassSchedule
        {
            Day = DayOfWeek.Monday,
            StartTime = new TimeOnly(8, 0),
            EndTime = new TimeOnly(9, 0)
        };
        var existingClass = new TrainingClass
        {
            Id = 2,
            CoachId = coachId,
            Schedules = new List<ClassSchedule> { existingSchedule }
        };
        RepoMock.Setup(r => r.GetAllAsync())
            .ReturnsAsync(new List<TrainingClass> { existingClass });

        var updatedClass = new TrainingClass
        {
            Id = classId,
            CoachId = coachId,
            Schedules = new List<ClassSchedule>
            {
                new ClassSchedule
                {
                    Day = DayOfWeek.Monday,
                    StartTime = new TimeOnly(9, 30),
                    EndTime = new TimeOnly(10, 30)
                }
            }
        };

        RepoMock.Setup(r => r.UpdateAsync(It.IsAny<TrainingClass>()))
            .Returns(Task.CompletedTask);

        // Act
        Func<Task> act = async () => await Service.UpdateAsync(updatedClass);

        // Assert
        await act.Should().NotThrowAsync();
    }

    #endregion

    #region DeleteAsync

    [Fact]
    public async Task DeleteAsync_Should_Call_Repository_With_Correct_Id()
    {
        // Arrange
        var classId = 42;
        RepoMock.Setup(r => r.DeleteAsync(classId)).Returns(Task.CompletedTask);

        // Act
        await Service.DeleteAsync(classId);

        // Assert
        RepoMock.Verify(r => r.DeleteAsync(classId), Times.Once);
    }

    #endregion

    #region GetByIdAsync

    [Fact]
    public async Task GetByIdAsync_Should_Return_TrainingClass_When_Found()
    {
        // Arrange
        var classId = 7;
        var expectedClass = new TrainingClass { Id = classId, Name = "Test Class" };
        RepoMock.Setup(r => r.GetByIdAsync(classId)).ReturnsAsync(expectedClass);

        // Act
        var result = await Service.GetByIdAsync(classId);

        // Assert
        result.Should().Be(expectedClass);
    }

    [Fact]
    public async Task GetByIdAsync_Should_Return_Null_When_Not_Found()
    {
        // Arrange
        var classId = 99;
        RepoMock.Setup(r => r.GetByIdAsync(classId)).ReturnsAsync((TrainingClass?)null);

        // Act
        var result = await Service.GetByIdAsync(classId);

        // Assert
        result.Should().BeNull();
    }

    #endregion

    #region GetAllAsync

    [Fact]
    public async Task GetAllAsync_ReturnsAllTrainingClasses()
    {
        // Arrange
        var trainingClasses = new List<TrainingClass>
        {
            new TrainingClass { Id = 1, Name = "Class 1" },
            new TrainingClass { Id = 2, Name = "Class 2" }
        };
        RepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(trainingClasses);

        var service = new TrainingClassService(
            RepoMock.Object,
            _currentUserServiceMock.Object,
            _mapperMock.Object,
            _userRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _StudentClassAttendanceRepositoryMock.Object);

        // Act
        var result = await service.GetAllAsync();

        // Assert
        result.Should().BeEquivalentTo(trainingClasses);
        RepoMock.Verify(r => r.GetAllAsync(), Times.Once);
    }

    #endregion

    #region GetClassesForCurrentCoachAsync

    [Fact]
    public async Task GetClassesForCurrentCoachAsync_ReturnsClasses_WhenUserIsCoach()
    {
        // Arrange
        var coachId = 5;
        var coachRole = new UserRole { Id = 1, Name = "Coach" };
        var user = new User
        {
            Id = coachId,
            UserUserRoles = new List<UserUserRole>
        {
            new UserUserRole { UserId = coachId, UserRoleId = coachRole.Id, UserRole = coachRole }
        }
        };

        _currentUserServiceMock.Setup(s => s.GetCurrentUserAsync()).ReturnsAsync(user);

        var trainingClasses = new List<TrainingClass>
    {
        new TrainingClass { Id = 1, Name = "Class 1", CoachId = coachId },
        new TrainingClass { Id = 2, Name = "Class 2", CoachId = coachId }
    };
        RepoMock.Setup(r => r.GetByCoachIdAsync(coachId)).ReturnsAsync(trainingClasses);

        var trainingClassDtos = new List<TrainingClassDto>
    {
        new TrainingClassDto { Id = 1, Name = "Class 1", CoachId = coachId },
        new TrainingClassDto { Id = 2, Name = "Class 2", CoachId = coachId }
    };
        _mapperMock.Setup(m => m.Map<IEnumerable<TrainingClassDto>>(trainingClasses)).Returns(trainingClassDtos);

        var service = new TrainingClassService(
            RepoMock.Object,
            _currentUserServiceMock.Object,
            _mapperMock.Object,
            _userRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _StudentClassAttendanceRepositoryMock.Object);

        // Act
        var result = await service.GetClassesForCurrentCoachAsync();

        // Assert
        result.Should().BeEquivalentTo(trainingClassDtos);
        _currentUserServiceMock.Verify(s => s.GetCurrentUserAsync(), Times.Once);
        RepoMock.Verify(r => r.GetByCoachIdAsync(coachId), Times.Once);
        _mapperMock.Verify(m => m.Map<IEnumerable<TrainingClassDto>>(trainingClasses), Times.Once);
    }

    #endregion


    #region AddStudentToClassAsync

    [Fact]
    public async Task AddStudentToClassAsync_ThrowsException_WhenTrainingClassNotFound()
    {
        // Arrange
        var trainingClassId = 1;
        var studentId = 2;

        RepoMock.Setup(r => r.GetByIdAsync(trainingClassId)).ReturnsAsync((TrainingClass)null);

        var service = new TrainingClassService(
            RepoMock.Object,
            _currentUserServiceMock.Object,
            _mapperMock.Object,
            _userRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _StudentClassAttendanceRepositoryMock.Object);

        // Act
        Func<Task> act = async () => await service.AddStudentToClassAsync(trainingClassId, studentId);

        // Assert
        await act.Should().ThrowAsync<Exception>().WithMessage("Training class not found.");
    }

    [Fact]
    public async Task AddStudentToClassAsync_ThrowsException_WhenStudentNotFound()
    {
        // Arrange
        var trainingClassId = 1;
        var studentId = 2;
        var trainingClass = new TrainingClass
        {
            Id = trainingClassId,
            StudentClasses = new List<StudentClass>()
        };

        RepoMock.Setup(r => r.GetByIdAsync(trainingClassId)).ReturnsAsync(trainingClass);
        _userRepositoryMock.Setup(r => r.GetByIdAsync(studentId)).ReturnsAsync((User)null);

        var service = new TrainingClassService(
            RepoMock.Object,
            _currentUserServiceMock.Object,
            _mapperMock.Object,
            _userRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _StudentClassAttendanceRepositoryMock.Object);

        // Act
        Func<Task> act = async () => await service.AddStudentToClassAsync(trainingClassId, studentId);

        // Assert
        await act.Should().ThrowAsync<Exception>().WithMessage("Student not found.");
    }

    [Fact]
    public async Task AddStudentToClassAsync_ThrowsInvalidOperationException_WhenStudentAlreadyEnrolled()
    {
        // Arrange
        var trainingClassId = 1;
        var studentId = 2;
        var trainingClass = new TrainingClass
        {
            Id = trainingClassId,
            StudentClasses = new List<StudentClass>
        {
            new StudentClass { StudentId = studentId, TrainingClassId = trainingClassId }
        }
        };
        var student = new User { Id = studentId };

        RepoMock.Setup(r => r.GetByIdAsync(trainingClassId)).ReturnsAsync(trainingClass);
        _userRepositoryMock.Setup(r => r.GetByIdAsync(studentId)).ReturnsAsync(student);

        var service = new TrainingClassService(
            RepoMock.Object,
            _currentUserServiceMock.Object,
            _mapperMock.Object,
            _userRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _StudentClassAttendanceRepositoryMock.Object);

        // Act
        Func<Task> act = async () => await service.AddStudentToClassAsync(trainingClassId, studentId);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("Student is already enrolled in this class.");
    }

    #endregion

    #region GetByCoachIdAsync

    [Fact]
    public async Task GetByCoachIdAsync_ReturnsClassesForCoach()
    {
        // Arrange
        var coachId = 7;
        var trainingClasses = new List<TrainingClass>
    {
        new TrainingClass { Id = 1, Name = "Class 1", CoachId = coachId },
        new TrainingClass { Id = 2, Name = "Class 2", CoachId = coachId }
    };
        RepoMock.Setup(r => r.GetByCoachIdAsync(coachId)).ReturnsAsync(trainingClasses);

        var service = new TrainingClassService(
            RepoMock.Object,
            _currentUserServiceMock.Object,
            _mapperMock.Object,
            _userRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _StudentClassAttendanceRepositoryMock.Object);

        // Act
        var result = await service.GetByCoachIdAsync(coachId);

        // Assert
        result.Should().BeEquivalentTo(trainingClasses);
        RepoMock.Verify(r => r.GetByCoachIdAsync(coachId), Times.Once);
    }

    #endregion

    #region RegisterAttendanceAsync

    [Fact]
    public async Task RegisterAttendanceAsync_ThrowsException_WhenStudentClassNotFound()
    {
        // Arrange
        var studentClassId = 1;
        var attendedAt = DateTime.UtcNow;
        var status = AttendanceStatus.Present;
        string? notes = "On time";

        var studentClassRepoMock = new Mock<IStudentClassRepository>();
        studentClassRepoMock.Setup(r => r.GetByIdAsync(studentClassId)).ReturnsAsync((StudentClass)null);

        _unitOfWorkMock.Setup(u => u.StudentClasses).Returns(studentClassRepoMock.Object);

        var service = new TrainingClassService(
            RepoMock.Object,
            _currentUserServiceMock.Object,
            _mapperMock.Object,
            _userRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _StudentClassAttendanceRepositoryMock.Object);

        // Act
        Func<Task> act = async () => await service.RegisterAttendanceAsync(studentClassId, attendedAt, status, notes);

        // Assert
        await act.Should().ThrowAsync<Exception>().WithMessage("StudentClass relationship not found.");
    }

    [Fact]
    public async Task RegisterAttendanceAsync_AddsAttendance_WhenStudentClassExists()
    {
        // Arrange
        var studentClassId = 1;
        var attendedAt = DateTime.UtcNow;
        var status = AttendanceStatus.Present;
        string? notes = "On time";

        var studentClass = new StudentClass { Id = studentClassId };

        var studentClassRepoMock = new Mock<IStudentClassRepository>();
        studentClassRepoMock.Setup(r => r.GetByIdAsync(studentClassId)).ReturnsAsync(studentClass);

        _unitOfWorkMock.Setup(u => u.StudentClasses).Returns(studentClassRepoMock.Object);

        _StudentClassAttendanceRepositoryMock
            .Setup(r => r.AddAsync(It.IsAny<StudentClassAttendance>()))
            .Returns(Task.CompletedTask)
            .Verifiable();

        var service = new TrainingClassService(
            RepoMock.Object,
            _currentUserServiceMock.Object,
            _mapperMock.Object,
            _userRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _StudentClassAttendanceRepositoryMock.Object);

        // Act
        await service.RegisterAttendanceAsync(studentClassId, attendedAt, status, notes);

        // Assert
        _StudentClassAttendanceRepositoryMock.Verify(r => r.AddAsync(It.Is<StudentClassAttendance>(
            a => a.StudentClassId == studentClassId &&
                 a.AttendedAt == attendedAt &&
                 a.Status == status &&
                 a.Notes == notes)), Times.Once);
    }

    #endregion


    #region GetAttendanceHistoryAsync

    [Fact]
    public async Task GetAttendanceHistoryAsync_ReturnsByDateRange_WhenFromAndToProvided()
    {
        // Arrange
        var studentClassId = 1;
        var from = new DateTime(2024, 1, 1);
        var to = new DateTime(2024, 1, 31);

        var expected = new List<StudentClassAttendance>
    {
        new StudentClassAttendance { Id = 1, StudentClassId = studentClassId, AttendedAt = new DateTime(2024, 1, 10) }
    };

        _StudentClassAttendanceRepositoryMock
            .Setup(r => r.GetByDateRangeAsync(from, to, studentClassId))
            .ReturnsAsync(expected);

        var service = new TrainingClassService(
            RepoMock.Object,
            _currentUserServiceMock.Object,
            _mapperMock.Object,
            _userRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _StudentClassAttendanceRepositoryMock.Object);

        // Act
        var result = await service.GetAttendanceHistoryAsync(studentClassId, from, to);

        // Assert
        result.Should().BeEquivalentTo(expected);
        _StudentClassAttendanceRepositoryMock.Verify(r => r.GetByDateRangeAsync(from, to, studentClassId), Times.Once);
    }

    [Fact]
    public async Task GetAttendanceHistoryAsync_ReturnsByStudentClassId_WhenNoDateRange()
    {
        // Arrange
        var studentClassId = 1;

        var expected = new List<StudentClassAttendance>
    {
        new StudentClassAttendance { Id = 2, StudentClassId = studentClassId, AttendedAt = new DateTime(2024, 2, 10) }
    };

        _StudentClassAttendanceRepositoryMock
            .Setup(r => r.GetByStudentClassIdAsync(studentClassId))
            .ReturnsAsync(expected);

        var service = new TrainingClassService(
            RepoMock.Object,
            _currentUserServiceMock.Object,
            _mapperMock.Object,
            _userRepositoryMock.Object,
            _unitOfWorkMock.Object,
            _StudentClassAttendanceRepositoryMock.Object);

        // Act
        var result = await service.GetAttendanceHistoryAsync(studentClassId);

        // Assert
        result.Should().BeEquivalentTo(expected);
        _StudentClassAttendanceRepositoryMock.Verify(r => r.GetByStudentClassIdAsync(studentClassId), Times.Once);
    }

    #endregion
}
