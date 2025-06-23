using Azure.Messaging.ServiceBus;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using TKDHubAPI.Application.Settings;
using TKDHubAPI.WebAPI.Converters;

namespace TKDHubAPI.WebAPI;

/// <summary>
/// Provides extension methods for registering Web API services and dependencies.
/// </summary>
public static class DependencyInjection
{
    /// <summary>
    /// Registers all Web API services, middleware, and dependencies.
    /// </summary>
    /// <param name="services">The service collection to add dependencies to.</param>
    /// <param name="configuration">The application configuration.</param>
    /// <returns>The updated service collection.</returns>
    public static IServiceCollection AddWebAPIServices(this IServiceCollection services, IConfiguration configuration)
    {
        // 1. Add Controllers and JSON Options
        services.AddControllers()
            .AddJsonOptions(options =>
            {
                // Register custom converter for TimeOnly
                options.JsonSerializerOptions.Converters.Add(new TimeOnlyJsonConverter());
            });

        // 2. Add API Explorer for Swagger
        services.AddEndpointsApiExplorer();

        // 3. Configure and Add CORS
        // Bind CorsSettings from configuration
        services.Configure<CorsSettings>(configuration.GetSection("Cors"));
        var corsSettings = configuration.GetSection("Cors").Get<CorsSettings>() ?? new CorsSettings();

        services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.WithOrigins(corsSettings.AllowedOrigins)
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
        });

        // 4. Add Swagger/OpenAPI Generation
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "TKDHub API", Version = "v1" });
        });

        // 5. Add HTTP Context Accessor
        services.AddHttpContextAccessor();

        // 6. Configure and Add JWT Authentication
        // Bind JwtSettings from configuration
        var jwtSection = configuration.GetSection("Jwt");
        services.Configure<JwtSettings>(jwtSection);
        var jwtSettings = jwtSection.Get<JwtSettings>();

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            // Configure JWT token validation parameters
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings.Issuer,
                ValidAudience = jwtSettings.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key))
            };
        });

        // 7. Add Authorization
        services.AddAuthorization();

        // 8. Register WebAPI-specific Services or Middleware
        // Example: services.AddScoped<ExceptionHandlingMiddleware>();

        // 9. Register Azure Service Bus Client
        var serviceBusConnectionString = configuration.GetSection("AzureServiceBus")["ConnectionString"];
        services.AddSingleton(new ServiceBusClient(serviceBusConnectionString));

        return services;
    }
}
