namespace TKDHubAPI.Application.Test.Services;

public abstract class BaseServiceTest<TService, TRepository>
    where TRepository : class
{
    protected virtual Mock<TRepository> RepoMock { get; }
    protected virtual TService Service { get; }

    /// <summary>
    /// Use this overload for services with a single repository dependency.
    /// </summary>
    protected BaseServiceTest(Func<Mock<TRepository>, TService> serviceFactory)
    {
        RepoMock = new Mock<TRepository>();
        Service = serviceFactory(RepoMock);
    }

    /// <summary>
    /// Use this overload for services with multiple dependencies.
    /// </summary>
    protected BaseServiceTest(
        Func<Mock<TRepository>, object[], TService> serviceFactory,
        params object[] additionalDependencies)
    {
        RepoMock = new Mock<TRepository>();
        Service = serviceFactory(RepoMock, additionalDependencies);
    }
}
