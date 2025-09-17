using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text;
using TKDHubAPI.Application.Settings;
using TKDHubAPI.WebAPI.Converters;
using TKDHubAPI.WebAPI.Swagger;

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
    public static IServiceCollection AddWebAPIServices(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        // 1. Add Controllers and JSON Options
        services
            .AddControllers()
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
        var corsSettings =
            configuration.GetSection("Cors").Get<CorsSettings>() ?? new CorsSettings();

        services.AddCors(options =>
        {
            options.AddPolicy(
                "AllowFrontend",
                policy =>
                {
                    policy
                        .WithOrigins(corsSettings.AllowedOrigins ?? Array.Empty<string>())
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                    //.AllowCredentials();
                }
            );
        });

        // 4. Add Swagger/OpenAPI Generation
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "TKDHub API", Version = "v1" });

            // Include XML comments from this assembly and related projects (if generated)
            try
            {
                var basePath = AppContext.BaseDirectory;
                var thisXml = Path.Combine(
                    basePath,
                    Assembly.GetExecutingAssembly().GetName().Name + ".xml"
                );
                if (File.Exists(thisXml))
                    c.IncludeXmlComments(thisXml);

                var appXml = Path.Combine(basePath, "TKDHubAPI.Application.xml");
                if (File.Exists(appXml))
                    c.IncludeXmlComments(appXml);

                var domainXml = Path.Combine(basePath, "TKDHubAPI.Domain.xml");
                if (File.Exists(domainXml))
                    c.IncludeXmlComments(domainXml);
            }
            catch
            {
                // ignore failures to include xml comments
            }

            // Add document filter for tags descriptions
            c.DocumentFilter<TagsDocumentFilter>();
            // Add document filter to remove hidden/obsolete endpoints
            c.DocumentFilter<HiddenEndpointsDocumentFilter>();

            // Add JWT Bearer definition
            c.AddSecurityDefinition(
                "Bearer",
                new OpenApiSecurityScheme
                {
                    Description =
                        "JWT Authorization header using the Bearer scheme. Example: 'Bearer {token}'",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                }
            );

            // Add global security requirement
            c.AddSecurityRequirement(
                new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer",
                            },
                        },
                        Array.Empty<string>()
                    },
                }
            );
        });

        // 5. Add HTTP Context Accessor
        services.AddHttpContextAccessor();

        // 6. Configure and Add JWT Authentication
        // Bind JwtSettings from configuration
        var jwtSection = configuration.GetSection("Jwt");
        services.Configure<JwtSettings>(jwtSection);
        var jwtSettings = jwtSection.Get<JwtSettings>()!;

        services
            .AddAuthentication(options =>
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
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtSettings.Key)
                    ),
                };
            });

        // 7. Add Authorization
        services.AddAuthorization();

        // 8. Register WebAPI-specific Services or Middleware
        // Example: services.AddScoped<ExceptionHandlingMiddleware>();

        // 9. Add SignalR
        services.AddSignalR().AddAzureSignalR();

        return services;
    }
}
