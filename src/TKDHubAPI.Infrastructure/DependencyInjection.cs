using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Infrastructure.Repositories;
using TKDHubAPI.Infrastructure.Services;
using TKDHubAPI.Infrastructure.Settings;

namespace TKDHubAPI.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // 1. Register the DbContext
        services.AddDbContext<TkdHubDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        // Configure MercadoPago settings and validate required fields at startup
        services.Configure<MercadoPagoSettings>(configuration.GetSection("MercadoPago"));
        services.AddOptions<MercadoPagoSettings>()
            .Bind(configuration.GetSection("MercadoPago"))
            .Validate(settings =>
            {
                // Run DataAnnotations validation manually
                var validationResults = new List<System.ComponentModel.DataAnnotations.ValidationResult>();
                var context = new System.ComponentModel.DataAnnotations.ValidationContext(settings);
                bool valid = System.ComponentModel.DataAnnotations.Validator.TryValidateObject(settings, context, validationResults, true);
                if (!valid) return false;

                // Additional predicate validation - only check required fields
                return !string.IsNullOrWhiteSpace(settings.AccessToken) && !string.IsNullOrWhiteSpace(settings.PublicKey);
            }, "MercadoPago AccessToken and PublicKey must be provided and valid")
            .ValidateOnStart();

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
        services.AddScoped<IGenericRepository<UserUserRole>, GenericRepository<UserUserRole>>();


        // Register MercadoPago implementation using typed HttpClient for EnhancedMercadoPagoService
        services.AddHttpClient<IMercadoPagoService, EnhancedMercadoPagoService>();

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
        services.AddScoped<IUserUserRoleRepository, UserUserRoleRepository>();

        return services;
    }
}
