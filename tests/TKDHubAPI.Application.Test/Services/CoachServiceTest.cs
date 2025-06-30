using TKDHubAPI.Application.DTOs.User;

namespace TKDHubAPI.Application.Test.Services;

public class CoachServiceTest : BaseServiceTest<CoachService, IUserRepository>
{
    private readonly Mock<IUserService> _userServiceMock;
    private readonly Mock<IDojaangRepository> _dojaangRepositoryMock;
    private readonly Mock<IMapper> _mapperMock;

    public CoachServiceTest()
        : this(new Mock<IUserService>(), new Mock<IDojaangRepository>(), new Mock<IMapper>())
    {
    }

    private CoachServiceTest(
        Mock<IUserService> userServiceMock,
        Mock<IDojaangRepository> dojaangRepositoryMock,
        Mock<IMapper> mapperMock)
        : base(
            (repoMock, deps) =>
                new CoachService(
                    ((Mock<IUserService>)deps[0]).Object,
                    ((Mock<IDojaangRepository>)deps[1]).Object,
                    ((Mock<IMapper>)deps[2]).Object
                ),
            userServiceMock, dojaangRepositoryMock, mapperMock)
    {
        _userServiceMock = userServiceMock;
        _dojaangRepositoryMock = dojaangRepositoryMock;
        _mapperMock = mapperMock;
    }

    #region GetCoachByIdAsync

    [Fact]
    public async Task GetCoachByIdAsync_ShouldReturnUserDto_WhenCoachExists()
    {
        // Arrange
        var coachId = 1;
        var user = new User { Id = coachId, FirstName = "John" };
        var userDto = new UserDto { Id = coachId, FirstName = "John" };

        _userServiceMock.Setup(s => s.GetByIdAsync(coachId)).ReturnsAsync(user);
        _mapperMock.Setup(m => m.Map<UserDto>(user)).Returns(userDto);

        // Act
        var service = new CoachService(_userServiceMock.Object, _dojaangRepositoryMock.Object, _mapperMock.Object);
        var result = await service.GetCoachByIdAsync(coachId);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(coachId);
        result.FirstName.Should().Be("John");
    }

    [Fact]
    public async Task GetCoachByIdAsync_ShouldReturnNull_WhenCoachDoesNotExist()
    {
        // Arrange
        var coachId = 99;
        _userServiceMock.Setup(s => s.GetByIdAsync(coachId)).ReturnsAsync((User)null);

        // Act
        var result = await Service.GetCoachByIdAsync(coachId);

        // Assert
        result.Should().BeNull();
    }

    #endregion

    #region GetAllCoachesAsync

    [Fact]
    public async Task GetAllCoachesAsync_ShouldReturnAllCoaches()
    {
        // Arrange
        var users = new List<User>
{
    new User { Id = 1, FirstName = "John" },
    new User { Id = 2, FirstName = "Jane" }
};
        var userDtos = new List<UserDto>
{
    new UserDto { Id = 1, FirstName = "John" },
    new UserDto { Id = 2, FirstName = "Jane" }
};

        _userServiceMock.Setup(s => s.GetUsersByRoleAsync("Coach")).ReturnsAsync(users);
        _mapperMock.Setup(m => m.Map<UserDto>(It.IsAny<User>()))
            .Returns<User>(u => userDtos.FirstOrDefault(dto => dto.Id == u.Id));

        // Act
        var result = await Service.GetAllCoachesAsync();

        // Assert
        result.Should().HaveCount(2);
        result.Should().ContainSingle(x => x.Id == 1);
        result.Should().ContainSingle(x => x.Id == 2);
    }

    #endregion

    #region GetManagedDojaangsAsync

    [Fact]
    public async Task GetManagedDojaangsAsync_ShouldReturnManagedDojaangs()
    {
        // Arrange
        var coachId = 1;
        var dojaangs = new List<Dojaang>
            {
                new Dojaang { Id = 10, Name = "A" },
                new Dojaang { Id = 20, Name = "B" }
            };
        var managedDtos = new List<ManagedDojaangDto>
            {
                new ManagedDojaangDto { Id = 10, Name = "A" },
                new ManagedDojaangDto { Id = 20, Name = "B" }
            };

        _dojaangRepositoryMock.Setup(r => r.GetDojaangsByCoachIdAsync(coachId)).ReturnsAsync(dojaangs);
        _mapperMock.Setup(m => m.Map<List<ManagedDojaangDto>>(dojaangs)).Returns(managedDtos);

        // Act
        var result = await Service.GetManagedDojaangsAsync(coachId);

        // Assert
        result.Should().HaveCount(2);
        result.Should().ContainSingle(x => x.Id == 10);
        result.Should().ContainSingle(x => x.Id == 20);
    }

    #endregion

    #region AddManagedDojaangAsync

    [Fact]
    public async Task AddManagedDojaangAsync_ShouldCallUserServiceAddCoachToDojaangRelation()
    {
        // Arrange
        var coachId = 1;
        var dojaangId = 10;

        _userServiceMock.Setup(s => s.AddCoachToDojaangRelationAsync(coachId, dojaangId)).Returns(Task.CompletedTask);

        // Act
        await Service.AddManagedDojaangAsync(coachId, dojaangId);

        // Assert
        _userServiceMock.Verify(s => s.AddCoachToDojaangRelationAsync(coachId, dojaangId), Times.Once);
    }

    #endregion

    #region RemoveManagedDojaangAsync

    [Fact]
    public async Task RemoveManagedDojaangAsync_ShouldCallUserServiceRemoveCoachFromDojaang()
    {
        // Arrange
        var coachId = 1;
        var dojaangId = 10;

        _userServiceMock.Setup(s => s.RemoveCoachFromDojaangAsync(coachId, dojaangId)).Returns(Task.CompletedTask);

        // Act
        await Service.RemoveManagedDojaangAsync(coachId, dojaangId);

        // Assert
        _userServiceMock.Verify(s => s.RemoveCoachFromDojaangAsync(coachId, dojaangId), Times.Once);
    }

    #endregion

    #region GetCoachesByDojaangAsync

    [Fact]
    public async Task GetCoachesByDojaangAsync_ShouldReturnCoaches()
    {
        // Arrange
        var dojaangId = 10;
        var users = new List<User>
{
    new User { Id = 1, FirstName = "John", Dojaang = new Dojaang { Id = dojaangId } },
    new User { Id = 2, FirstName = "Jane", Dojaang = new Dojaang { Id = dojaangId } }
};
        var userDtos = new List<UserDto>
    {
        new UserDto { Id = 1, FirstName = "John" },
        new UserDto { Id = 2, FirstName = "Jane" }
    };

        _userServiceMock.Setup(s => s.GetUsersByRoleAsync("Coach")).ReturnsAsync(users);
        _mapperMock.Setup(m => m.Map<UserDto>(It.IsAny<User>()))
            .Returns<User>(u => userDtos.FirstOrDefault(dto => dto.Id == u.Id));

        // Act
        var result = await Service.GetCoachesByDojaangAsync(dojaangId);

        // Assert
        result.Should().HaveCount(2);
        result.Should().ContainSingle(x => x.Id == 1);
        result.Should().ContainSingle(x => x.Id == 2);
    }

    #endregion

}
