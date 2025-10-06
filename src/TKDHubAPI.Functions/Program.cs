using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TKDHubAPI.Application;
using TKDHubAPI.Infrastructure;

namespace TKDHubFunctions;

public class Program
{
    public static async Task Main(string[] args)
    {
        var host = new HostBuilder()
            .ConfigureFunctionsWorkerDefaults()
            .ConfigureServices(
                (context, services) =>
                {
                    services.AddApplicationInsightsTelemetryWorkerService();
                    services.ConfigureFunctionsApplicationInsights();

                    // Add CORS support
                    services.AddCors(options =>
                    {
                        options.AddPolicy(
                            "AllowAll",
                            builder =>
                            {
                                builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                            }
                        );
                    });

                    // Add IHttpContextAccessor for Azure Functions
                    services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

                    // Add Application and Infrastructure layers
                    services.AddApplication(context.Configuration);
                    services.AddInfrastructure(context.Configuration);

                    // Configure JWT settings for Functions (used by JwtHelper)
                    services.Configure<TKDHubAPI.Application.Settings.JwtSettings>(
                        context.Configuration.GetSection("Jwt")
                    );

                    // Add database migration service
                    services.AddSingleton<
                        TKDHubFunctions.Services.IDatabaseMigrationService,
                        TKDHubFunctions.Services.DatabaseMigrationService
                    >();
                }
            )
            .Build();

        await host.RunAsync();
    }
}
