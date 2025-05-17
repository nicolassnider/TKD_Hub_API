using Microsoft.Extensions.DependencyInjection;

namespace TKDHubAPI.Application;
public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Register application services here, e.g.:
        // services.AddScoped<IUserService, UserService>();
        // services.AddScoped<IEventService, EventService>();
        // Add other service registrations as needed
        return services;
    }

}
