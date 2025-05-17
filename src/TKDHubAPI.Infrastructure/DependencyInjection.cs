using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TKDHubAPI.Infrastructure.Data;

namespace TKDHubAPI.Infrastructure;
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Register the DbContext with SQL Server (change to your provider if needed)
        services.AddDbContext<TkdHubDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        // Register repositories here, e.g.:
        // services.AddScoped<IUserRepository, UserRepository>();
        // services.AddScoped<IRankRepository, RankRepository>();
        // Add other repository registrations as needed

        return services;
    }
}
