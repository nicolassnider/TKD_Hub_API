using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace TKDHubAPI.WebAPI;

public static class DependencyInjection
{
    public static IServiceCollection AddWebAPIServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Add controllers and API explorer
        services.AddControllers();
        services.AddEndpointsApiExplorer();

        // Add Swagger/OpenAPI
        services.AddSwaggerGen();

        // Add Authentication (JWT Bearer)
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                // Configure JWT options here as needed
                // Example:
                // options.TokenValidationParameters = new TokenValidationParameters
                // {
                //     ValidateIssuer = true,
                //     ValidateAudience = true,
                //     ValidateLifetime = true,
                //     ValidateIssuerSigningKey = true,
                //     ValidIssuer = configuration["Jwt:Issuer"],
                //     ValidAudience = configuration["Jwt:Audience"],
                //     IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]))
                // };
            });

        // Add Authorization
        services.AddAuthorization();

        // Add any WebAPI-specific services or filters here
        // Example:
        // services.AddScoped<ExceptionHandlingMiddleware>();

        return services;
    }
}
