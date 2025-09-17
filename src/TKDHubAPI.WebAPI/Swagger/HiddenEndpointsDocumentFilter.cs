using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace TKDHubAPI.WebAPI.Swagger;

/// <summary>
/// Removes operations from the generated OpenAPI document when they are marked as Obsolete
/// or have ApiExplorerSettings(IgnoreApi = true).
/// This keeps Swagger UI focused on supported public endpoints.
/// </summary>
public class HiddenEndpointsDocumentFilter : IDocumentFilter
{
    public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
    {
        // Build a set of operationIds to remove based on attributes on the action descriptors
        var toRemove = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var apiDescription in context.ApiDescriptions)
        {
            // Check ApiExplorer settings (ApiDescription.IsDeprecated extension may not be available in this target framework)
            // Fall back to conservative default; explicit Obsolete or ApiExplorerSettings attributes are checked below.
            var ignoreApi = false;

            // The action descriptor may be a ControllerActionDescriptor where we can inspect attributes
            if (apiDescription.ActionDescriptor is ControllerActionDescriptor cad)
            {
                // ObsoleteAttribute
                var hasObsolete = cad.MethodInfo.GetCustomAttributes(true)
                    .Any(a => a is ObsoleteAttribute);

                // ApiExplorerSettingsAttribute with IgnoreApi = true
                var apiExplorerAttr = cad.MethodInfo.GetCustomAttributes(true)
                    .OfType<Microsoft.AspNetCore.Mvc.ApiExplorerSettingsAttribute>()
                    .FirstOrDefault();

                if (hasObsolete || (apiExplorerAttr?.IgnoreApi ?? false) || ignoreApi)
                {
                    // Use the reflected method name as the operation identifier to remove.
                    var operationId = cad.MethodInfo?.Name;
                    if (!string.IsNullOrEmpty(operationId))
                    {
                        toRemove.Add(operationId);
                    }
                }
            }
        }

        if (toRemove.Count == 0) return;

        // For each path and operation, check operation.OperationId and remove matches
        var pathsToRemove = new List<string>();
        foreach (var path in swaggerDoc.Paths.ToList())
        {
            var opsToRemove = path.Value.Operations
                .Where(kvp => !string.IsNullOrEmpty(kvp.Value.OperationId) && toRemove.Contains(kvp.Value.OperationId))
                .Select(kvp => kvp.Key)
                .ToList();

            foreach (var httpMethod in opsToRemove)
            {
                path.Value.Operations.Remove(httpMethod);
            }

            // If no operations remain for this path, mark the path for removal
            if (!path.Value.Operations.Any())
            {
                pathsToRemove.Add(path.Key);
            }
        }

        foreach (var p in pathsToRemove)
        {
            swaggerDoc.Paths.Remove(p);
        }
    }
}
