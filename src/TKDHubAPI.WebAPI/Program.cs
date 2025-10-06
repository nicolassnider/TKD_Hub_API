using Microsoft.Azure.SignalR;
using Microsoft.EntityFrameworkCore;
using TKDHubAPI.Application;
using TKDHubAPI.Infrastructure;
using TKDHubAPI.Infrastructure.Data;
using TKDHubAPI.WebAPI;
using TKDHubAPI.WebAPI.SignalR;


var builder = WebApplication.CreateBuilder(args);


// Add services to the container using DI extension methods


builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication(builder.Configuration);
builder.Services.AddWebAPIServices(builder.Configuration);
builder
    .Services.AddSignalR()
    .AddAzureSignalR(builder.Configuration["Azure:SignalR:ConnectionString"]!);


var app = builder.Build();


// Initialize database with proper error handling
try
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<TkdHubDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
   
    logger.LogInformation("Checking database connection and migrations...");
   
    if (dbContext.Database.IsRelational())
    {
        // Test database connection first
        if (await dbContext.Database.CanConnectAsync())
        {
            var pendingMigrations = await dbContext.Database.GetPendingMigrationsAsync();
            if (pendingMigrations.Any())
            {
                logger.LogInformation("Applying {Count} pending migrations: {Migrations}",
                    pendingMigrations.Count(), string.Join(", ", pendingMigrations));
                await dbContext.Database.MigrateAsync();
                logger.LogInformation("Database migrations completed successfully");
            }
            else
            {
                logger.LogInformation("Database is up to date, no migrations needed");
            }
        }
        else
        {
            logger.LogWarning("Cannot connect to database. Application will start but database operations may fail.");
            logger.LogWarning("Please ensure the database is configured correctly and the managed identity has proper permissions.");
        }
    }
}
catch (Exception ex)
{
    var loggerFactory = app.Services.GetRequiredService<ILoggerFactory>();
    var logger = loggerFactory.CreateLogger<Program>();
    logger.LogError(ex, "Failed to initialize database. Application will continue but database operations may fail.");
    logger.LogError("Error: {Message}", ex.Message);
   
    // Don't fail the application startup, just log the error
    // This allows the app to start and serve health checks even if DB is not ready
}


// Configure the HTTP request pipeline.


app.UseMiddleware<CustomErrorResponseMiddleware>();


// Enable Swagger middleware
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "TKDHub API v1");
    c.RoutePrefix = "swagger"; // Optional: sets the Swagger UI at /swagger
});


app.UseHttpsRedirection();


// Serve static files from wwwroot (will host the frontend static export)
app.UseDefaultFiles();
app.UseStaticFiles();


app.UseRouting();


app.UseCors("AllowFrontend");


app.UseAuthentication();
app.UseAuthorization();


// Use top-level route registrations instead of UseEndpoints to satisfy analyzer ASP0014
app.MapHub<PaymentHub>("/paymentHub");
app.MapControllers();


// SPA fallback: serve index.html for unmatched routes (so client-side routing works)
app.MapFallbackToFile("index.html");


app.Run();