using TKDHubAPI.Application;
using TKDHubAPI.Infrastructure;
using TKDHubAPI.WebAPI;
using TKDHubAPI.WebAPI.Middlewares; // Ensure this namespace is included

var builder = WebApplication.CreateBuilder(args);
// Add services to the container using DI extension methods



builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication(builder.Configuration);
builder.Services.AddWebAPIServices(builder.Configuration);


var app = builder.Build();

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

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();


