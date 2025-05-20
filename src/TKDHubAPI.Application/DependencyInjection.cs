using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Application.Services;
using TKDHubAPI.Application.Validators.Dojaang;

namespace TKDHubAPI.Application;
public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Register application services here
        services.AddValidatorsFromAssemblyContaining<CreateDojaangDtoValidator>(); // Registers all validators in the assembly

        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IEventService, EventService>();
        services.AddScoped<ITournamentService, TournamentService>();
        services.AddScoped<IRankService, RankService>();
        services.AddScoped<IDojaangService, DojaangService>();

        // Configure AutoMapper
        services.AddAutoMapper(Assembly.GetExecutingAssembly()); // Registers AutoMapper and finds mapping profiles

        return services;
    }

}

