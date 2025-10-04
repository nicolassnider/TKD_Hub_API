using System.Reflection;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
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
                    var origins = corsSettings.AllowedOrigins ?? Array.Empty<string>();

                    // If configuration contains a single wildcard '*' we allow any origin (useful for local dev).
                    if (
                        origins.Length == 1
                        && (origins[0] == "*" || string.IsNullOrWhiteSpace(origins[0]))
                    )
                    {
                        // In development it's OK to allow any origin, but credentials cannot be allowed together with AnyOrigin.
                        if (corsSettings.AllowCredentials)
                        {
                            // When AllowCredentials is true but origins is '*', fall back to echoing the Origin header at runtime.
                            // We'll set up the policy to allow any header/method and use a custom policy for credentials at runtime in middleware.
                            policy
                                .SetIsOriginAllowed(_ => true)
                                .AllowAnyHeader()
                                .AllowAnyMethod()
                                .AllowCredentials()
                                .WithExposedHeaders(
                                    "X-Pagination",
                                    "X-Current-Page",
                                    "X-Total-Pages",
                                    "X-Page-Size",
                                    "X-Total-Count",
                                    "X-Has-Next",
                                    "X-Has-Previous"
                                );
                        }
                        else
                        {
                            policy
                                .AllowAnyOrigin()
                                .AllowAnyHeader()
                                .AllowAnyMethod()
                                .WithExposedHeaders(
                                    "X-Pagination",
                                    "X-Current-Page",
                                    "X-Total-Pages",
                                    "X-Page-Size",
                                    "X-Total-Count",
                                    "X-Has-Next",
                                    "X-Has-Previous"
                                );
                        }
                    }
                    else
                    {
                        // Use explicit origins. When credentials are allowed, this is the correct pattern.
                        policy
                            .WithOrigins(origins)
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .WithExposedHeaders(
                                "X-Pagination",
                                "X-Current-Page",
                                "X-Total-Pages",
                                "X-Page-Size",
                                "X-Total-Count",
                                "X-Has-Next",
                                "X-Has-Previous"
                            );
                        if (corsSettings.AllowCredentials)
                        {
                            policy.AllowCredentials();
                        }
                    }
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
