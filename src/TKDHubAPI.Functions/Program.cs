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


                // Add database migration service
                services.AddSingleton<TKDHubFunctions.Services.IDatabaseMigrationService, TKDHubFunctions.Services.DatabaseMigrationService>();
            })
            .Build();


        await host.RunAsync();
    }
}
