using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Application.Services;
using TKDHubAPI.Domain.Entities;
using TKDHubAPI.Domain.Repositories;
using TKDHubAPI.Infrastructure.Data;
using TKDHubAPI.Infrastructure.Repositories;

namespace TKDHubAPI.Infrastructure;
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // 1. Register the DbContext
        services.AddDbContext<TkdHubDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        // 2. Register Repositories and Unit of Work
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IGenericRepository<Dojaang>, GenericRepository<Dojaang>>();
        services.AddScoped<IDojaangRepository, DojaangRepository>();
        services.AddScoped<IRankRepository, RankRepository>();
        services.AddScoped<ITournamentRepository, TournamentRepository>();
        services.AddScoped<IEventRepository, EventRepository>();
        services.AddScoped<ITulRepository, TulRepository>();
        services.AddScoped<IEventAttendanceRepository, EventAttendanceRepository>();


        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // 3.  Register Application Services (if you have them in this project)
        services.AddScoped<IDojaangService, DojaangService>();
        services.AddScoped<IRankService, RankService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ITournamentService, TournamentService>();
        services.AddScoped<IEventService, EventService>();
        services.AddScoped<ITulService, TulService>();

        // 4. Add Logging (Optional, but highly recommended) - Already handled by default, but configure if needed
        //   If you are using the default ASP.NET Core logging, you don't need to do anything here.
        //   If you're using a custom logging provider (like Serilog), configure it here.
        //   For example, with Serilog:
        // services.AddSingleton<ILoggerFactory>(provider =>
        // {
        //     var configuration = provider.GetRequiredService<IConfiguration>();
        //     Log.Logger = new LoggerConfiguration()
        //         .ReadFrom.Configuration(configuration)
        //         .CreateLogger();
        //     return new SerilogLoggerFactory(Log.Logger);
        // });
        // services.AddLogging(); // Make sure the Logging service is registered.


        return services;
    }
}
