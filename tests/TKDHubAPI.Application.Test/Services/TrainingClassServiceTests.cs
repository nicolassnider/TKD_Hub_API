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
}
