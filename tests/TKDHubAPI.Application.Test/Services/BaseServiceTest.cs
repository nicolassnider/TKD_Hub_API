namespace TKDHubAPI.Application.Test.Services;

public abstract class BaseServiceTest<TService, TRepository>
    where TRepository : class
{
    protected virtual Mock<TRepository> RepoMock { get; }
    protected virtual TService Service { get; }

    protected BaseServiceTest(Func<Mock<TRepository>, TService> serviceFactory)
    {
        RepoMock = new Mock<TRepository>();
        Service = serviceFactory(RepoMock);
    }
}
