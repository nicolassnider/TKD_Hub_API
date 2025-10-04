using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using TKDHubAPI.Application.Services;
using TKDHubAPI.Application.Settings;

namespace TKDHubAPI.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        // Register JWT settings
        services.Configure<JwtSettings>(configuration.GetSection("Jwt"));

        // Register Dojaang settings
        services.Configure<DojaangSettings>(configuration.GetSection("DojaangSettings"));

        // Register all FluentValidation validators in this assembly
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        // Register MediatR
        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly())
        );

        services.Configure<PaginationSettings>(configuration.GetSection("PaginationSettings"));

        // Register application services


        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IEventService, EventService>();
        services.AddScoped<ITournamentService, TournamentService>();
        services.AddScoped<IRankService, RankService>();
        services.AddScoped<IDojaangService, DojaangService>();
        services.AddScoped<IPromotionService, PromotionService>();
        services.AddScoped<ICoachService, CoachService>();
        services.AddScoped<IStudentService, StudentService>();
        services.AddScoped<ITulService, TulService>();
        services.AddScoped<ITrainingClassService, TrainingClassService>();
        services.AddScoped<IClassScheduleService, ClassScheduleService>();
        services.AddScoped<IStudentClassService, StudentClassService>();
        services.AddScoped<IBlogPostService, BlogPostService>();

        services.AddScoped(typeof(IPaginationService<>), typeof(PaginationService<>));

        // Register AutoMapper profiles in this assembly
        services.AddAutoMapper(Assembly.GetExecutingAssembly());

        // Optionally, configure FluentValidation to use DataAnnotations as well
        ValidatorOptions.Global.LanguageManager.Enabled = true;

        return services;
    }
}
