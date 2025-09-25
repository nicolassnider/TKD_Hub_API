using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using TKDHubAPI.Application;
using TKDHubAPI.Infrastructure;
using TKDHubAPI.Infrastructure.Data;

namespace TKDHubFunctions;

public class Program
{
    public static async Task Main(string[] args)
    {
        var host = new HostBuilder()
            .ConfigureFunctionsWorkerDefaults()
            .ConfigureServices((context, services) =>
            {
                services.AddApplicationInsightsTelemetryWorkerService();
                services.ConfigureFunctionsApplicationInsights();

                // Add CORS support
                services.AddCors(options =>
                {
                    options.AddPolicy("AllowAll", builder =>
                    {
                        builder.AllowAnyOrigin()
                               .AllowAnyMethod()
                               .AllowAnyHeader();
                    });
                });

                // Add IHttpContextAccessor for Azure Functions
                services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

                // Add Application and Infrastructure layers
                services.AddApplication(context.Configuration);
                services.AddInfrastructure(context.Configuration);
            })
            .Build();

        // Run database migrations on startup
        await RunMigrationsAsync(host.Services);

        await host.RunAsync();
    }

    private static async Task RunMigrationsAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

        try
        {
            logger.LogInformation("Starting database migration...");

            var context = scope.ServiceProvider.GetRequiredService<TkdHubDbContext>();
            await context.Database.MigrateAsync();

            logger.LogInformation("Database migration completed successfully");

            // Data seeding is handled by Entity Framework HasData in OnModelCreating
            logger.LogInformation("Database seeding will be applied with migrations");
            logger.LogInformation("Database seeding completed successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while migrating the database");
            // Don't throw - let the app start anyway in case of migration issues
        }
    }
}
