using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TKDHubAPI.Domain.Entities;
using TKDHubAPI.Domain.Repositories;
using TKDHubAPI.Infrastructure.Data;
using TKDHubAPI.Infrastructure.Repositories;

namespace TKDHubAPI.Infrastructure;
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Register the DbContext with SQL Server (change to your provider if needed)
        services.AddDbContext<TkdHubDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        // Register repositories and unit of work
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IGenericRepository<Dojang>, GenericRepository<Dojang>>(); // Add this line for Dojang
        services.AddScoped<IDojangRepository, DojangRepository>();
        // Register other repositories here as you implement them, e.g.:
        // services.AddScoped<IRankRepository, RankRepository>();
        // services.AddScoped<ITournamentRepository, TournamentRepository>();
        // services.AddScoped<IEventRepository, EventRepository>();
        // ...

        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}
