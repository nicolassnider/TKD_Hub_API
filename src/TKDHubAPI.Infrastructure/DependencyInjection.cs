// Make sure this is TKDHubAPI.Application.Settings for your ServiceBusSettings
// using TKDHubAPI.Infrastructure.Settings; // This was in your original, ensure paths are correct for your structure
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Infrastructure.External;
using TKDHubAPI.Infrastructure.Repositories;
using TKDHubAPI.Infrastructure.Settings;

namespace TKDHubAPI.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // 1. Register the DbContext
        services.AddDbContext<TkdHubDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.Configure<MercadoPagoSettings>(configuration.GetSection("MercadoPago"));

        // Register IUnitOfWork for DI
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Register generic repositories for all relevant entities
        services.AddScoped<IGenericRepository<User>, GenericRepository<User>>();
        services.AddScoped<IGenericRepository<UserDojaang>, GenericRepository<UserDojaang>>();
        services.AddScoped<IGenericRepository<Rank>, GenericRepository<Rank>>();
        services.AddScoped<IGenericRepository<Tournament>, GenericRepository<Tournament>>();
        services.AddScoped<IGenericRepository<Event>, GenericRepository<Event>>();
        services.AddScoped<IGenericRepository<Tul>, GenericRepository<Tul>>();
        services.AddScoped<IGenericRepository<EventAttendance>, GenericRepository<EventAttendance>>();
        services.AddScoped<IGenericRepository<UserRole>, GenericRepository<UserRole>>();
        services.AddScoped<IGenericRepository<Promotion>, GenericRepository<Promotion>>();
        services.AddScoped<IGenericRepository<TrainingClass>, GenericRepository<TrainingClass>>(); // Added TrainingClass
        services.AddScoped<IGenericRepository<ClassSchedule>, GenericRepository<ClassSchedule>>(); // Added ClassSchedule
        services.AddScoped<IGenericRepository<StudentClass>, GenericRepository<StudentClass>>(); // Added StudentClass
        services.AddScoped<IGenericRepository<BlogPost>, GenericRepository<BlogPost>>(); // Added BlogPost



        services.AddScoped<IMercadoPagoService, MercadoPagoService>();

        // Register specific repositories
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IDojaangRepository, DojaangRepository>();
        services.AddScoped<IRankRepository, RankRepository>();
        services.AddScoped<ITournamentRepository, TournamentRepository>();
        services.AddScoped<IEventRepository, EventRepository>();
        services.AddScoped<ITulRepository, TulRepository>();
        services.AddScoped<IEventAttendanceRepository, EventAttendanceRepository>();
        services.AddScoped<IUserRoleRepository, UserRoleRepository>();
        services.AddScoped<IPromotionRepository, PromotionRepository>();
        services.AddScoped<IUserDojaangRepository, UserDojaangRepository>();
        services.AddScoped<ITrainingClassRepository, TrainingClassRepository>();
        services.AddScoped<IClassScheduleRepository, ClassScheduleRepository>();
        services.AddScoped<IStudentClassRepository, StudentClassRepository>();
        services.AddScoped<IBlogPostRepository, BlogPostRepository>();
        services.AddScoped<IStudentClassAttendanceRepository, StudentClassAttendanceRepository>();

        return services;
    }
}
