using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TKDHubAPI.Application;
using TKDHubAPI.Infrastructure;
using System.Threading.Tasks;

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
                
                // Add Application and Infrastructure layers
                services.AddApplication(context.Configuration);
                services.AddInfrastructure(context.Configuration);
            })
            .Build();

        await host.RunAsync();
    }
}
