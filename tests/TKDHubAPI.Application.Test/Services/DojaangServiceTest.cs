namespace TKDHubAPI.Application.Test.Services;

public class DojaangServiceTest : BaseServiceTest<DojaangService, IDojaangRepository>
{
    private readonly Mock<IUnitOfWork> _unitOfWorkMock = new();
    private readonly Mock<IUserDojaangRepository> _userDojaangRepoMock = new();
    private readonly Mock<IGenericRepository<User>> _userRepoMock = new();
    private readonly Mock<ICurrentUserService> _currentUserServiceMock = new();
    private readonly Mock<IMapper> _mapperMock = new();

    public DojaangServiceTest()
        : base(_ => null!) // Pass a dummy value; will set Service in the body
    {
        Service = new DojaangService(
            _unitOfWorkMock.Object,
            RepoMock.Object,
            _mapperMock.Object,
            _userRepoMock.Object,
            _currentUserServiceMock.Object,
            _userDojaangRepoMock.Object
        );
    }

    #region GetAllAsync

    [Fact]
    public async Task GetAllAsync_ShouldReturnEmpty_WhenNoCurrentUser()
    {
        // Arrange
        _currentUserServiceMock.Setup(s => s.GetCurrentUserAsync())
            .ReturnsAsync((User)null);

        // Act
        var result = await Service.GetAllAsync();

        // Assert
        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnAllForAdmin()
    {
        // Arrange
        var admin = new User
        {
            Id = 1,
            UserUserRoles = new List<UserUserRole>
            {
                new UserUserRole { UserRole = new UserRole { Name = "Admin" } }
            }
        };
        var dojaangs = new List<Dojaang> { new() { Id = 1 }, new() { Id = 2 } };
        var dtos = new List<DojaangDto> { new() { Id = 1 }, new() { Id = 2 } };

        _currentUserServiceMock.Setup(s => s.GetCurrentUserAsync()).ReturnsAsync(admin);
        RepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(dojaangs);
        _mapperMock.Setup(m => m.Map<IEnumerable<DojaangDto>>(dojaangs)).Returns(dtos);

        // Act
        var result = await Service.GetAllAsync();

        // Assert
        result.Should().BeEquivalentTo(dtos);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnDojaangsForCoach()
    {
        // Arrange
        var coach = new User
        {
            Id = 10,
            UserUserRoles = new List<UserUserRole>
            {
                new UserUserRole { UserRole = new UserRole { Name = "Coach" } }
            }
        };
        var userDojaangs = new List<UserDojaang>
        {
            new UserDojaang { User = coach, DojaangId = 100, Role = "Coach" }
        };
        var allDojaangs = new List<Dojaang>
        {
            new Dojaang { Id = 100, Name = "A" },
            new Dojaang { Id = 200, Name = "B" }
        };
        var dtos = new List<DojaangDto> { new() { Id = 100, Name = "A" } };

        _currentUserServiceMock.Setup(s => s.GetCurrentUserAsync()).ReturnsAsync(coach);
        _userDojaangRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(userDojaangs);
        RepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(allDojaangs);
        _mapperMock.Setup(m => m.Map<IEnumerable<DojaangDto>>(It.Is<IEnumerable<Dojaang>>(l => l.All(d => d.Id == 100)))).Returns(dtos);

        // Act
        var result = await Service.GetAllAsync();

        // Assert
        result.Should().BeEquivalentTo(dtos);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnDojaangsForStudent()
    {
        // Arrange
        var student = new User
        {
            Id = 20,
            UserUserRoles = new List<UserUserRole>
            {
                new UserUserRole { UserRole = new UserRole { Name = "Student" } }
            }
        };
        var userDojaangs = new List<UserDojaang>
        {
            new UserDojaang { User = student, DojaangId = 300, Role = "Student" }
        };
        var allDojaangs = new List<Dojaang>
        {
            new Dojaang { Id = 300, Name = "C" },
            new Dojaang { Id = 400, Name = "D" }
        };
        var dtos = new List<DojaangDto> { new() { Id = 300, Name = "C" } };

        _currentUserServiceMock.Setup(s => s.GetCurrentUserAsync()).ReturnsAsync(student);
        _userDojaangRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(userDojaangs);
        RepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(allDojaangs);
        _mapperMock.Setup(m => m.Map<IEnumerable<DojaangDto>>(It.Is<IEnumerable<Dojaang>>(l => l.All(d => d.Id == 300)))).Returns(dtos);

        // Act
        var result = await Service.GetAllAsync();

        // Assert
        result.Should().BeEquivalentTo(dtos);
    }

    #endregion

    #region GetByIdAsync

    [Fact]
    public async Task GetByIdAsync_ShouldReturnNull_WhenNotFound()
    {
        // Arrange
        RepoMock.Setup(r => r.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((Dojaang)null);

        // Act
        var result = await Service.GetByIdAsync(1);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnDtoWithCoach_WhenFoundAndCoachRelationExists()
    {
        // Arrange
        var dojaang = new Dojaang { Id = 1, Name = "Test", Address = "Addr", Location = "Loc", Email = "mail" };
        var dto = new DojaangDto { Id = 1, Name = "Test", Address = "Addr", Location = "Loc", Email = "mail" };
        var coach = new User { Id = 42, FirstName = "John", LastName = "Doe" };
        var coachRelation = new UserDojaang { UserId = 42, User = coach };

        RepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(dojaang);
        _mapperMock.Setup(m => m.Map<DojaangDto>(dojaang)).Returns(dto);
        _userDojaangRepoMock.Setup(r => r.GetCoachRelationForDojaangAsync(1)).ReturnsAsync(coachRelation);

        // Act
        var result = await Service.GetByIdAsync(1);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(1);
        result.CoachId.Should().Be(42);
        result.CoachName.Should().Be("John Doe");
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnDtoWithNoCoach_WhenFoundAndNoCoachRelation()
    {
        // Arrange
        var dojaang = new Dojaang { Id = 2, Name = "Test2", Address = "Addr2", Location = "Loc2", Email = "mail2" };
        var dto = new DojaangDto { Id = 2, Name = "Test2", Address = "Addr2", Location = "Loc2", Email = "mail2" };

        RepoMock.Setup(r => r.GetByIdAsync(2)).ReturnsAsync(dojaang);
        _mapperMock.Setup(m => m.Map<DojaangDto>(dojaang)).Returns(dto);
        _userDojaangRepoMock.Setup(r => r.GetCoachRelationForDojaangAsync(2)).ReturnsAsync((UserDojaang)null);

        // Act
        var result = await Service.GetByIdAsync(2);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(2);
        result.CoachId.Should().Be(0);
        result.CoachName.Should().BeEmpty();
    }

    #endregion

    #region AddAsync

    [Fact]
    public async Task AddAsync_ShouldCallRepositoryAndUnitOfWork()
    {
        // Arrange
        var dto = new CreateDojaangDto();
        var dojaang = new Dojaang();

        _mapperMock.Setup(m => m.Map<Dojaang>(dto)).Returns(dojaang);

        // Act
        await Service.AddAsync(dto);

        // Assert
        RepoMock.Verify(r => r.AddAsync(It.IsAny<Dojaang>()), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task AddAsync_WithCoachId_ShouldAddUserDojaangRelation()
    {
        // Arrange
        var dto = new CreateDojaangDto { CoachId = 42 };
        var dojaang = new Dojaang { Id = 99 };
        var coach = new User { Id = 42 };

        _mapperMock.Setup(m => m.Map<Dojaang>(dto)).Returns(dojaang);
        _userRepoMock.Setup(r => r.GetByIdAsync(42)).ReturnsAsync(coach);

        // Act
        await Service.AddAsync(dto);

        // Assert
        RepoMock.Verify(r => r.AddAsync(It.IsAny<Dojaang>()), Times.Once);
        _userDojaangRepoMock.Verify(r => r.AddAsync(It.Is<UserDojaang>(
            ud => ud.UserId == 42 && ud.DojaangId == 99 && ud.Role == "Coach"
        )), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
    }

    #endregion

    #region UpdateAsync

    [Fact]
    public async Task UpdateAsync_ShouldThrow_WhenNotFound()
    {
        // Arrange
        RepoMock.Setup(r => r.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((Dojaang)null);

        // Act
        Func<Task> act = async () => await Service.UpdateAsync(new UpdateDojaangDto { Id = 1 });

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("Dojaang not found.");
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateDojaangAndCallSaveChanges()
    {
        // Arrange
        var dto = new UpdateDojaangDto
        {
            Id = 1,
            Name = "Updated Name",
            Address = "Updated Address",
            Location = "Updated Location",
            Email = "updated@email.com",
            CoachId = 42
        };

        var dojaang = new Dojaang { Id = 1 };
        var coach = new User { Id = 42 };
        var userDojaangs = new List<UserDojaang>();

        RepoMock.Setup(r => r.GetByIdAsync(dto.Id)).ReturnsAsync(dojaang);
        _userRepoMock.Setup(r => r.GetByIdAsync(dto.CoachId.Value)).ReturnsAsync(coach);
        _userDojaangRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(userDojaangs);

        // Act
        Func<Task> act = async () => await Service.UpdateAsync(dto);

        // Assert
        await act.Should().NotThrowAsync();

        _mapperMock.Verify(m => m.Map(dto, dojaang), Times.Once);
        RepoMock.Verify(r => r.Update(dojaang), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);

        _userDojaangRepoMock.Verify(r => r.AddAsync(It.Is<UserDojaang>(
            ud => ud.User == coach && ud.DojaangId == dojaang.Id && ud.Role == "Coach"
        )), Times.Once);

        dojaang.Coach.Should().Be(coach);
        dojaang.CoachId.Should().Be(coach.Id);
    }

    #endregion

    #region DeleteAsync

    [Fact]
    public async Task DeleteAsync_ShouldCallRemove_WhenFound()
    {
        // Arrange
        var dojaang = new Dojaang { Id = 1 };
        RepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(dojaang);

        // Act
        await Service.DeleteAsync(1);

        // Assert
        RepoMock.Verify(r => r.Remove(dojaang), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
    }

    #endregion

    #region CreateDojaangAsync

    [Fact]
    public async Task CreateDojaangAsync_ShouldCreateDojaangAndReturnDto_WhenUserIsAdmin()
    {
        // Arrange
        var adminUser = new User
        {
            Id = 1,
            UserUserRoles = new List<UserUserRole>
            {
                new UserUserRole { UserRole = new UserRole { Name = "Admin" } }
            }
        };
        var dto = new CreateDojaangDto
        {
            Name = "Test Dojaang",
            Address = "123 Main St",
            Location = "City",
            Email = "test@dojaang.com",
            CoachId = 42
        };
        var dojaang = new Dojaang { Id = 10 };
        var coach = new User { Id = 42 };
        var expectedDto = new DojaangDto { Id = 10, Name = "Test Dojaang" };

        _mapperMock.Setup(m => m.Map<Dojaang>(dto)).Returns(dojaang);
        _userRepoMock.Setup(r => r.GetByIdAsync(42)).ReturnsAsync(coach);
        _mapperMock.Setup(m => m.Map<DojaangDto>(dojaang)).Returns(expectedDto);

        // Act
        var result = await Service.CreateDojaangAsync(dto, adminUser);

        // Assert
        _mapperMock.Verify(m => m.Map<Dojaang>(dto), Times.Once);
        RepoMock.Verify(r => r.AddAsync(dojaang), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Exactly(2));
        _userDojaangRepoMock.Verify(r => r.AddAsync(It.Is<UserDojaang>(
            ud => ud.UserId == 42 && ud.DojaangId == 10 && ud.Role == "Coach"
        )), Times.Once);
        _mapperMock.Verify(m => m.Map<DojaangDto>(dojaang), Times.Once);

        result.Should().BeEquivalentTo(expectedDto);
    }

    [Fact]
    public async Task CreateDojaangAsync_ShouldThrow_WhenUserIsNotAdmin()
    {
        // Arrange
        var nonAdminUser = new User
        {
            Id = 2,
            UserUserRoles = new List<UserUserRole>
            {
                new UserUserRole { UserRole = new UserRole { Name = "Student" } }
            }
        };
        var dto = new CreateDojaangDto();

        // Act
        Func<Task> act = async () => await Service.CreateDojaangAsync(dto, nonAdminUser);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("Only admins can create Dojaangs.");
    }

    #endregion

    #region GetDojaangsForCurrentCoachAsync

    [Fact]
    public async Task GetDojaangsForCurrentCoachAsync_ShouldReturnEmpty_WhenUserIsNullOrNotCoach()
    {
        // Arrange
        _currentUserServiceMock.Setup(s => s.GetCurrentUserAsync()).ReturnsAsync((User)null);

        // Act
        var resultNull = await Service.GetDojaangsForCurrentCoachAsync();

        // Assert
        resultNull.Should().BeEmpty();

        // Arrange
        var notCoach = new User
        {
            Id = 2,
            UserUserRoles = new List<UserUserRole>
        {
            new UserUserRole { UserRole = new UserRole { Name = "Student" } }
        }
        };
        _currentUserServiceMock.Setup(s => s.GetCurrentUserAsync()).ReturnsAsync(notCoach);

        // Act
        var resultNotCoach = await Service.GetDojaangsForCurrentCoachAsync();

        // Assert
        resultNotCoach.Should().BeEmpty();
    }

    [Fact]
    public async Task GetDojaangsForCurrentCoachAsync_ShouldReturnDojaangs_WhenUserIsCoach()
    {
        // Arrange
        var coach = new User
        {
            Id = 10,
            UserUserRoles = new List<UserUserRole>
        {
            new UserUserRole { UserRole = new UserRole { Name = "Coach" } }
        }
        };
        var dojaangs = new List<Dojaang>
    {
        new Dojaang { Id = 1, Name = "A" },
        new Dojaang { Id = 2, Name = "B" }
    };
        var dtos = new List<DojaangDto>
    {
        new DojaangDto { Id = 1, Name = "A" },
        new DojaangDto { Id = 2, Name = "B" }
    };

        _currentUserServiceMock.Setup(s => s.GetCurrentUserAsync()).ReturnsAsync(coach);
        RepoMock.Setup(r => r.GetDojaangsByCoachIdAsync(coach.Id)).ReturnsAsync(dojaangs);
        _mapperMock.Setup(m => m.Map<IEnumerable<DojaangDto>>(dojaangs)).Returns(dtos);

        // Act
        var result = await Service.GetDojaangsForCurrentCoachAsync();

        // Assert
        result.Should().BeEquivalentTo(dtos);
    }

    #endregion

    #region AssignCoachToDojaangAsync

    [Fact]
    public async Task AssignCoachToDojaangAsync_ShouldThrow_WhenDojaangNotFound()
    {
        // Arrange
        var dto = new UpdateDojaangDto { Id = 1, CoachId = 42 };
        RepoMock.Setup(r => r.GetByIdAsync(dto.Id)).ReturnsAsync((Dojaang)null);

        // Act
        Func<Task> act = async () => await Service.AssignCoachToDojaangAsync(dto);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("Dojaang not found.");
    }

    [Fact]
    public async Task AssignCoachToDojaangAsync_ShouldUpdateCoachAndReturnDto()
    {
        // Arrange
        var dto = new UpdateDojaangDto { Id = 1, CoachId = 42 };
        var dojaang = new Dojaang { Id = 1, Name = "Test" };
        var coach = new User { Id = 42, FirstName = "John", LastName = "Doe" };
        var expectedDto = new DojaangDto { Id = 1, Name = "Test", CoachId = 42, CoachName = "John Doe" };

        RepoMock.Setup(r => r.GetByIdAsync(dto.Id)).ReturnsAsync(dojaang);
        _userRepoMock.Setup(r => r.GetByIdAsync(dto.CoachId.Value)).ReturnsAsync(coach);
        _mapperMock.Setup(m => m.Map<DojaangDto>(dojaang)).Returns(expectedDto);

        // Act
        var result = await Service.AssignCoachToDojaangAsync(dto);

        // Assert
        _mapperMock.Verify(m => m.Map(dto, dojaang), Times.Once);
        RepoMock.Verify(r => r.Update(dojaang), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
        result.Should().BeEquivalentTo(expectedDto);
        dojaang.Coach.Should().Be(coach);
    }

    [Fact]
    public async Task AssignCoachToDojaangAsync_ShouldSetCoachToNull_WhenCoachIdIsNull()
    {
        // Arrange
        var dto = new UpdateDojaangDto { Id = 1, CoachId = null };
        var dojaang = new Dojaang { Id = 1, Name = "Test", Coach = new User { Id = 99 } };
        var expectedDto = new DojaangDto { Id = 1, Name = "Test", CoachId = 0, CoachName = string.Empty };

        RepoMock.Setup(r => r.GetByIdAsync(dto.Id)).ReturnsAsync(dojaang);
        _mapperMock.Setup(m => m.Map<DojaangDto>(dojaang)).Returns(expectedDto);

        // Act
        var result = await Service.AssignCoachToDojaangAsync(dto);

        // Assert
        _mapperMock.Verify(m => m.Map(dto, dojaang), Times.Once);
        RepoMock.Verify(r => r.Update(dojaang), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
        result.Should().BeEquivalentTo(expectedDto);
        dojaang.Coach.Should().BeNull();
    }

    #endregion
}
