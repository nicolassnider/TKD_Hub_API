using Microsoft.EntityFrameworkCore;
using TKDHubAPI.Application;
using TKDHubAPI.Infrastructure;
using TKDHubAPI.Infrastructure.Data;
using TKDHubAPI.WebAPI;
using TKDHubAPI.WebAPI.SignalR;
using Microsoft.Azure.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container using DI extension methods

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication(builder.Configuration);
builder.Services.AddWebAPIServices(builder.Configuration);
builder.Services.AddSignalR().AddAzureSignalR(builder.Configuration["Azure:SignalR:ConnectionString"]!);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<TkdHubDbContext>();
    if (dbContext.Database.IsRelational())
    {
        var pendingMigrations = dbContext.Database.GetPendingMigrations();
        if (pendingMigrations.Any())
        {
            dbContext.Database.Migrate();
        }
    }
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

app.UseRouting();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<PaymentHub>("/paymentHub");
});

app.MapControllers();

app.Run();
