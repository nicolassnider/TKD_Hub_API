using TKDHubAPI.Application.Services;
using TKDHubAPI.Domain.Repositories;


namespace TKDHubAPI.Application.Test.Services;


public class PromotionServiceTest : BaseServiceTest<PromotionService, IPromotionRepository>
{
    private readonly Mock<IUnitOfWork> _unitOfWorkMock = new();
    private readonly Mock<IUserRepository> _userRepoMock = new();
    private readonly Mock<IRankRepository> _rankRepoMock = new();
    private readonly Mock<IUserRoleRepository> _userRoleRepoMock = new();


    public PromotionServiceTest()
        : base((repoMock, deps) => new PromotionService(repoMock.Object, ((Mock<IUnitOfWork>)deps[0]).Object),
              new object[] { new Mock<IUnitOfWork>() })
    {
        // The BaseServiceTest created a different IUnitOfWork mock; replace Service manually to use our configured mocks
        _unitOfWorkMock.SetupGet(u => u.Users).Returns(_userRepoMock.Object);
        _unitOfWorkMock.SetupGet(u => u.Ranks).Returns(_rankRepoMock.Object);
        _unitOfWorkMock.SetupGet(u => u.UserRoles).Returns(_userRoleRepoMock.Object);


        Service = new PromotionService(RepoMock.Object, _unitOfWorkMock.Object);
    }


    [Fact]
    public async Task AddAsync_ShouldThrow_WhenStudentNotFound()
    {
        // Arrange
        var promotion = new Promotion { StudentId = 1, CoachId = 2, RankId = 3 };


        _userRepoMock.Setup(r => r.GetByIdAsync(promotion.StudentId)).ReturnsAsync((User)null);


        // Act
        Func<Task> act = async () => await Service.AddAsync(promotion);


        // Assert
        await act.Should().ThrowAsync<ArgumentException>().WithMessage("Student not found.*");
    }


    [Fact]
    public async Task AddAsync_ShouldThrow_WhenCoachNotFound()
    {
        // Arrange
        var student = new User { Id = 1, CurrentRankId = 10 };
        var promotion = new Promotion { StudentId = 1, CoachId = 2, RankId = 3 };


        _userRepoMock.Setup(r => r.GetByIdAsync(student.Id)).ReturnsAsync(student);
        // When called for coach id, return null
        _userRepoMock.Setup(r => r.GetByIdAsync(promotion.CoachId)).ReturnsAsync((User)null);


        // Act
        Func<Task> act = async () => await Service.AddAsync(promotion);


        // Assert
        await act.Should().ThrowAsync<ArgumentException>().WithMessage("Coach not found.*");
    }


    [Fact]
    public async Task AddAsync_ShouldThrow_WhenNoNextRank()
    {
        // Arrange
        var student = new User { Id = 1, CurrentRankId = 100 };
        var promotion = new Promotion { StudentId = 1, CoachId = 2, RankId = 200 };


        _userRepoMock.Setup(r => r.GetByIdAsync(student.Id)).ReturnsAsync(student);
        _userRepoMock.Setup(r => r.GetByIdAsync(promotion.CoachId)).ReturnsAsync(new User { Id = 2 });


        // Ranks list has only one rank -> no next rank
        _rankRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Rank> { new Rank { Id = 100, Order = 1 } });


        // Act
        Func<Task> act = async () => await Service.AddAsync(promotion);


        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("No next rank available*");
    }


    [Fact]
    public async Task AddAsync_ShouldThrow_WhenProvidedRankDoesNotMatchNext()
    {
        // Arrange
        var student = new User { Id = 1, CurrentRankId = 10 };
        var promotion = new Promotion { StudentId = 1, CoachId = 2, RankId = 999 };


        _userRepoMock.Setup(r => r.GetByIdAsync(student.Id)).ReturnsAsync(student);
        _userRepoMock.Setup(r => r.GetByIdAsync(promotion.CoachId)).ReturnsAsync(new User { Id = 2 });


        var ranks = new List<Rank>
        {
            new Rank { Id = 10, Order = 1 },
            new Rank { Id = 11, Order = 2 } // next rank id is 11
        };
        _rankRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(ranks);


        // Act
        Func<Task> act = async () => await Service.AddAsync(promotion);


        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("Provided rankId does not match the next available rank*");
    }


    [Fact]
    public async Task AddAsync_ShouldAddPromotionAndUpdateUser_WhenValidAndPromotedToFirstDan()
    {
        // Arrange
        var student = new User { Id = 1, CurrentRankId = 10, UserUserRoles = new List<UserUserRole>() };
        var coach = new User { Id = 2 };
        var nextRank = new Rank { Id = 11, Order = 2, DanLevel = 1 };
        var promotion = new Promotion { StudentId = 1, CoachId = 2, RankId = 11 };


        _userRepoMock.Setup(r => r.GetByIdAsync(student.Id)).ReturnsAsync(student);
        _userRepoMock.Setup(r => r.GetByIdAsync(promotion.CoachId)).ReturnsAsync(coach);


        _rankRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Rank>
        {
            new Rank { Id = 10, Order = 1 },
            nextRank
        });


        var coachRole = new UserRole { Id = 5, Name = "Coach" };
        _userRoleRepoMock.Setup(r => r.GetByNameAsync("Coach")).ReturnsAsync(coachRole);


        // Setup AddAsync to return completed task (IGenericRepository.AddAsync returns Task)
        RepoMock.Setup(r => r.AddAsync(It.IsAny<Promotion>())).Returns(Task.CompletedTask);


        _unitOfWorkMock.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);


        // Act
        await Service.AddAsync(promotion);


        // Assert
        RepoMock.Verify(r => r.AddAsync(It.IsAny<Promotion>()), Times.Once);
        _userRepoMock.Verify(r => r.Update(student), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
        student.CurrentRankId.Should().Be(nextRank.Id);
        student.UserUserRoles.Should().ContainSingle(uur => uur.UserRoleId == coachRole.Id);
    }


    [Fact]
    public async Task DeleteAsync_ShouldRemoveAndSaveWhenExists()
    {
        // Arrange
        var promotion = new Promotion { Id = 7 };
        RepoMock.Setup(r => r.GetByIdAsync(7)).ReturnsAsync(promotion);
        _unitOfWorkMock.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);


        // Act
        await Service.DeleteAsync(7);


        // Assert
        RepoMock.Verify(r => r.Remove(promotion), Times.Once);
        _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
    }


    [Fact]
    public async Task GetAllAsync_ShouldReturnAllPromotions()
    {
        // Arrange
        var promotions = new List<Promotion> { new Promotion { Id = 1 }, new Promotion { Id = 2 } };
        RepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(promotions);


        // Act
        var result = await Service.GetAllAsync();


        // Assert
        result.Should().BeEquivalentTo(promotions);
    }


    [Fact]
    public async Task GetPromotionsByStudentIdAsync_ShouldFilterByStudentId()
    {
        // Arrange
        var promotions = new List<Promotion>
        {
            new Promotion { Id = 1, StudentId = 5 },
            new Promotion { Id = 2, StudentId = 6 }
        };
        RepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(promotions);


        // Act
        var result = await Service.GetPromotionsByStudentIdAsync(5);


        // Assert
        result.Should().ContainSingle(p => p.StudentId == 5);
    }
}
