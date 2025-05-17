using Microsoft.Extensions.DependencyInjection;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Application.Services;

namespace TKDHubAPI.Application;
public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Register application services here
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IEventService, EventService>();
        services.AddScoped<ITournamentService, TournamentService>();
        services.AddScoped<IRankService, RankService>();
        services.AddScoped<IDojangService, DojangService>();
        return services;
    }

}
