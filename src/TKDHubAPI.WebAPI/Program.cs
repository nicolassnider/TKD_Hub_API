using TKDHubAPI.Application;
using TKDHubAPI.Infrastructure;
using TKDHubAPI.WebAPI; // Ensure this namespace is included

var builder = WebApplication.CreateBuilder(args);

// Add services to the container using DI extension methods
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();
builder.Services.AddWebAPIServices(builder.Configuration);


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
