using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Application.Services;
using TKDHubAPI.Application.Validators;

namespace TKDHubAPI.Application;
public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Register application services here
        services.AddValidatorsFromAssemblyContaining<CreateDojangDtoValidator>(); // Registers all validators in the assembly

        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IEventService, EventService>();
        services.AddScoped<ITournamentService, TournamentService>();
        services.AddScoped<IRankService, RankService>();
        services.AddScoped<IDojangService, DojangService>();
        return services;
    }

}
