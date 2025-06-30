namespace TKDHubAPI.Application.Test.Services;

/// <summary>
/// Base class for service unit tests, providing a mocked repository and an instance of the service under test.
/// </summary>
/// <typeparam name="TService">The concrete service type being tested.</typeparam>
/// <typeparam name="TRepository">The repository interface type to be mocked.</typeparam>
public abstract class BaseServiceTest<TService, TRepository>
    where TRepository : class
{
    /// <summary>
    /// Gets the mock instance of the repository interface.
    /// </summary>
    protected Mock<TRepository> RepoMock { get; }

    /// <summary>
    /// Gets or sets the instance of the service under test.
    /// </summary>
    protected TService Service { get; set; }

    /// <summary>
    /// Initializes a new instance of the <see cref="BaseServiceTest{TService, TRepository}"/> class
    /// using a service factory that takes a repository mock.
    /// </summary>
    /// <param name="serviceFactory">A factory function to create the service instance using the repository mock.</param>
    protected BaseServiceTest(Func<Mock<TRepository>, TService> serviceFactory)
    {
        RepoMock = new Mock<TRepository>();
        Service = serviceFactory(RepoMock);
    }

    /// <summary>
    /// Initializes a new instance of the <see cref="BaseServiceTest{TService, TRepository}"/> class
    /// using a service factory that takes a repository mock and additional dependencies.
    /// </summary>
    /// <param name="serviceFactory">A factory function to create the service instance using the repository mock and additional dependencies.</param>
    /// <param name="additionalDependencies">Additional dependencies required by the service constructor.</param>
    protected BaseServiceTest(
        Func<Mock<TRepository>, object[], TService> serviceFactory,
        params object[] additionalDependencies)
    {
        RepoMock = new Mock<TRepository>();
        Service = serviceFactory(RepoMock, additionalDependencies);
    }
}
