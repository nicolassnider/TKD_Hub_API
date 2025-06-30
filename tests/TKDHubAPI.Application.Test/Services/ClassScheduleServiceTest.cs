namespace TKDHubAPI.Application.Test.Services;

public class ClassScheduleServiceTest : BaseServiceTest<ClassScheduleService, IClassScheduleRepository>
{
    public ClassScheduleServiceTest()
        : base((repoMock, _) => new ClassScheduleService(repoMock.Object))
    {
    }

    #region CreateAsync

    [Fact]
    public async Task CreateAsync_ShouldReturnCreatedClassSchedule()
    {
        // Arrange
        var schedule = new ClassSchedule
        {
            Id = 1,
            TrainingClassId = 10,
            Day = DayOfWeek.Monday,
            StartTime = new TimeOnly(9, 0),
            EndTime = new TimeOnly(10, 0)
        };

        RepoMock.Setup(r => r.AddAsync(It.IsAny<ClassSchedule>())).ReturnsAsync(schedule);

        // Act
        var result = await Service.CreateAsync(schedule);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(1);
        result.TrainingClassId.Should().Be(10);
        result.Day.Should().Be(DayOfWeek.Monday);
        result.StartTime.Should().Be(new TimeOnly(9, 0));
        result.EndTime.Should().Be(new TimeOnly(10, 0));
    }

    #endregion

    #region GetByIdAsync

    [Fact]
    public async Task GetByIdAsync_ShouldReturnClassSchedule_WhenFound()
    {
        // Arrange
        var schedule = new ClassSchedule { Id = 2, TrainingClassId = 20 };
        RepoMock.Setup(r => r.GetByIdAsync(2)).ReturnsAsync(schedule);

        // Act
        var result = await Service.GetByIdAsync(2);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(2);
        result.TrainingClassId.Should().Be(20);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnNull_WhenNotFound()
    {
        // Arrange
        RepoMock.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((ClassSchedule?)null);

        // Act
        var result = await Service.GetByIdAsync(99);

        // Assert
        result.Should().BeNull();
    }

    #endregion

    #region GetByTrainingClassIdAsync

    [Fact]
    public async Task GetByTrainingClassIdAsync_ShouldReturnSchedules()
    {
        // Arrange
        var schedules = new List<ClassSchedule>
        {
            new ClassSchedule { Id = 1, TrainingClassId = 100 },
            new ClassSchedule { Id = 2, TrainingClassId = 100 }
        };
        RepoMock.Setup(r => r.GetByTrainingClassIdAsync(100)).ReturnsAsync(schedules);

        // Act
        var result = await Service.GetByTrainingClassIdAsync(100);

        // Assert
        result.Should().HaveCount(2);
        result.Should().OnlyContain(s => s.TrainingClassId == 100);
    }

    [Fact]
    public async Task GetByTrainingClassIdAsync_ShouldReturnEmpty_WhenNoneFound()
    {
        // Arrange
        RepoMock.Setup(r => r.GetByTrainingClassIdAsync(200)).ReturnsAsync(new List<ClassSchedule>());

        // Act
        var result = await Service.GetByTrainingClassIdAsync(200);

        // Assert
        result.Should().BeEmpty();
    }

    #endregion

    #region UpdateAsync

    [Fact]
    public async Task UpdateAsync_ShouldCallRepositoryUpdate()
    {
        // Arrange
        var schedule = new ClassSchedule { Id = 3, TrainingClassId = 300 };

        // Act
        await Service.UpdateAsync(schedule);

        // Assert
        RepoMock.Verify(r => r.UpdateAsync(schedule), Times.Once);
    }

    #endregion

    #region DeleteAsync

    [Fact]
    public async Task DeleteAsync_ShouldCallRepositoryDelete()
    {
        // Arrange
        var id = 4;

        // Act
        await Service.DeleteAsync(id);

        // Assert
        RepoMock.Verify(r => r.DeleteAsync(id), Times.Once);
    }

    #endregion
}
