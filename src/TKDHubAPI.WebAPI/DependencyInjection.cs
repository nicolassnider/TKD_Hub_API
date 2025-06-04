using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using TKDHubAPI.Application.Settings;

namespace TKDHubAPI.WebAPI;

public static class DependencyInjection
{
    public static IServiceCollection AddWebAPIServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Add controllers and API explorer
        services.AddControllers();
        services.AddEndpointsApiExplorer();


        services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.WithOrigins(
                    "http://localhost:3000",
                    "https://tkdhubweb-bvbqgpf0ead7c8e7.eastus-01.azurewebsites.net/",
                    "https://tkdhubwenc-badpg5fbd6c8a7cf.canadacentral-01.azurewebsites.net"
                    )
        .AllowAnyHeader()
        .AllowAnyMethod();
            });
        });




        // Add Swagger/OpenAPI
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "TKDHub API", Version = "v1" });
        });


        services.AddHttpContextAccessor();


        // Bind JwtSettings from configuration
        var jwtSection = configuration.GetSection("Jwt");
        services.Configure<JwtSettings>(jwtSection);
        var jwtSettings = jwtSection.Get<JwtSettings>();


        // Add Authentication (JWT Bearer)
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
            .AddJwtBearer(options =>
            {
                // Configure JWT options here as needed
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


        // Add Authorization
        services.AddAuthorization();


        // Add any WebAPI-specific services or filters here
        // Example:
        // services.AddScoped<ExceptionHandlingMiddleware>();


        return services;
    }
}
