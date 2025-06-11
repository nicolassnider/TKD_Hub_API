namespace TKDHubAPI.Application.Test.Services
{
    public class DojaangServiceTest : BaseServiceTest<DojaangService, IDojaangRepository>
    {
        private static readonly Mock<IUnitOfWork> _unitOfWorkMock = new();
        private static readonly Mock<IUserDojaangRepository> _userDojaangRepoMock = new();
        private static readonly Mock<IGenericRepository<User>> _userRepoMock = new();
        private static readonly Mock<ICurrentUserService> _currentUserServiceMock = new();
        private static readonly Mock<IMapper> _mapperMock = new();

        public DojaangServiceTest()
            : base(repoMock =>
                new DojaangService(
                    _unitOfWorkMock.Object,
                    repoMock.Object,
                    _mapperMock.Object,
                    _userRepoMock.Object,
                    _currentUserServiceMock.Object,
                    _userDojaangRepoMock.Object
                )
            )
        {
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnEmpty_WhenNoCurrentUser()
        {
            _currentUserServiceMock.Setup(s => s.GetCurrentUserAsync())
                .ReturnsAsync((User)null);

            var result = await Service.GetAllAsync();

            result.Should().BeEmpty();
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllForAdmin()
        {
            var admin = new User
            {
                Id = 1,
                UserUserRoles = new List<UserUserRole>
                {
                    new UserUserRole
                    {
                        UserRole = new UserRole { Name = "Admin" }
                    }
                }
            };

            var dojaangs = new List<Dojaang> { new() { Id = 1 }, new() { Id = 2 } };
            var dtos = new List<DojaangDto> { new() { Id = 1 }, new() { Id = 2 } };

            _currentUserServiceMock.Setup(s => s.GetCurrentUserAsync()).ReturnsAsync(admin);
            RepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(dojaangs);
            _mapperMock.Setup(m => m.Map<IEnumerable<DojaangDto>>(dojaangs)).Returns(dtos);

            var result = await Service.GetAllAsync();

            result.Should().BeEquivalentTo(dtos);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnNull_WhenNotFound()
        {
            RepoMock.Setup(r => r.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((Dojaang)null);

            var result = await Service.GetByIdAsync(1);

            result.Should().BeNull();
        }

        [Fact]
        public async Task AddAsync_ShouldCallRepositoryAndUnitOfWork()
        {
            var dto = new CreateDojaangDto();
            var dojaang = new Dojaang();

            _mapperMock.Setup(m => m.Map<Dojaang>(dto)).Returns(dojaang);

            await Service.AddAsync(dto);

            RepoMock.Verify(r => r.AddAsync(It.IsAny<Dojaang>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_ShouldThrow_WhenNotFound()
        {
            RepoMock.Setup(r => r.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((Dojaang)null);

            Func<Task> act = async () => await Service.UpdateAsync(new UpdateDojaangDto { Id = 1 });

            await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("Dojaang not found.");
        }

        [Fact]
        public async Task DeleteAsync_ShouldCallRemove_WhenFound()
        {
            var dojaang = new Dojaang { Id = 1 };
            RepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(dojaang);

            await Service.DeleteAsync(1);

            RepoMock.Verify(r => r.Remove(dojaang), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
        }
    }
}
