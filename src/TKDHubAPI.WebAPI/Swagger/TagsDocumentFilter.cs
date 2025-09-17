using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace TKDHubAPI.WebAPI.Swagger;

/// <summary>
/// Adds OpenAPI tags with descriptions so Swagger UI shows a short general description per controller group.
/// </summary>
public class TagsDocumentFilter : IDocumentFilter
{
    public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
    {
        swaggerDoc.Tags = new List<OpenApiTag>
        {
            new OpenApiTag { Name = "Auth", Description = "Authentication endpoints: login and token issuance." },
            new OpenApiTag { Name = "BlogPosts", Description = "Manage blog posts: create, read, update, and delete posts." },
            new OpenApiTag { Name = "Classes", Description = "Training class management, schedules, and attendance operations." },
            new OpenApiTag { Name = "Coaches", Description = "Manage coach users and their associated dojaangs." },
            new OpenApiTag { Name = "Dashboards", Description = "Dashboard data endpoints for coaches and admins." },
            new OpenApiTag { Name = "Dojaangs", Description = "Manage dojaangs (martial arts schools): CRUD and coach assignment." },
            new OpenApiTag { Name = "MercadoLibreWebhook", Description = "Webhook receiver for MercadoLibre notifications (payment events)." },
            new OpenApiTag { Name = "Promotions", Description = "Manage student promotions and update student ranks." },
            new OpenApiTag { Name = "Ranks", Description = "Retrieve rank definitions and metadata." },
            new OpenApiTag { Name = "Students", Description = "Student user management and enrollment in training classes." },
            new OpenApiTag { Name = "Tuls", Description = "Retrieve and filter Tuls (patterns/forms) by rank." },
            new OpenApiTag { Name = "Users", Description = "User management endpoints: create, update, delete, register, and coach-specific queries." }
        };
    }
}
