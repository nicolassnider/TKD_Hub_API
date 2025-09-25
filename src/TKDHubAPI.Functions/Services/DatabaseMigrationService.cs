using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using TKDHubAPI.Infrastructure.Data;


namespace TKDHubFunctions.Services;


public interface IDatabaseMigrationService
{
    Task EnsureDatabaseCreatedAsync();
}


public class DatabaseMigrationService : IDatabaseMigrationService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<DatabaseMigrationService> _logger;
    private static bool _migrationRun = false;
    private static readonly object _migrationLock = new object();


    public DatabaseMigrationService(IServiceProvider serviceProvider, ILogger<DatabaseMigrationService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }


    public async Task EnsureDatabaseCreatedAsync()
    {
        if (_migrationRun)
            return;


        lock (_migrationLock)
        {
            if (_migrationRun)
                return;


            try
            {
                using var scope = _serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<TkdHubDbContext>();


                _logger.LogInformation("Checking database migrations...");


                // Apply pending migrations
                var pendingMigrations = context.Database.GetPendingMigrations();
                if (pendingMigrations.Any())
                {
                    _logger.LogInformation($"Applying {pendingMigrations.Count()} pending migrations...");
                    context.Database.Migrate();
                    _logger.LogInformation("Database migrations completed successfully");
                }
                else
                {
                    _logger.LogInformation("No pending migrations found");
                }


                _migrationRun = true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during database migration");
                throw;
            }
        }
    }
}
