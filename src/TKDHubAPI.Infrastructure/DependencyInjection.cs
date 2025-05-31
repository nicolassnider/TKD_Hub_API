using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TKDHubAPI.Infrastructure.Repositories;

namespace TKDHubAPI.Infrastructure;
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // 1. Register the DbContext
        services.AddDbContext<TkdHubDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));


        // Register IUnitOfWork for DI
        services.AddScoped<IUnitOfWork, UnitOfWork>();


        // Register generic repositories for all relevant entities EXCEPT Dojaang
        services.AddScoped<IGenericRepository<User>, GenericRepository<User>>();
        // services.AddScoped<IGenericRepository<Dojaang>, GenericRepository<Dojaang>>(); // <-- REMOVE THIS LINE
        services.AddScoped<IGenericRepository<Rank>, GenericRepository<Rank>>();
        services.AddScoped<IGenericRepository<Tournament>, GenericRepository<Tournament>>();
        services.AddScoped<IGenericRepository<Event>, GenericRepository<Event>>();
        services.AddScoped<IGenericRepository<Tul>, GenericRepository<Tul>>();
        services.AddScoped<IGenericRepository<EventAttendance>, GenericRepository<EventAttendance>>();
        services.AddScoped<IGenericRepository<UserRole>, GenericRepository<UserRole>>();
        services.AddScoped<IGenericRepository<Promotion>, GenericRepository<Promotion>>();


        // Register specific repositories
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IDojaangRepository, DojaangRepository>(); // <-- KEEP THIS LINE
        services.AddScoped<IRankRepository, RankRepository>();
        services.AddScoped<ITournamentRepository, TournamentRepository>();
        services.AddScoped<IEventRepository, EventRepository>();
        services.AddScoped<ITulRepository, TulRepository>();
        services.AddScoped<IEventAttendanceRepository, EventAttendanceRepository>();
        services.AddScoped<IUserRoleRepository, UserRoleRepository>();
        services.AddScoped<IPromotionRepository, PromotionRepository>();


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
