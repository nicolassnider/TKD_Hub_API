using System.Net;

namespace TKDHubAPI.WebAPI.Middlewares;

public class CustomErrorResponseMiddleware
{
    private readonly RequestDelegate _next;
    private const string ErrorMessageKey = "CustomErrorMessage";

    public CustomErrorResponseMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var originalBody = context.Response.Body;
        using var memStream = new MemoryStream();
        context.Response.Body = memStream;

        await _next(context);

        memStream.Seek(0, SeekOrigin.Begin);
        string responseBody = await new StreamReader(memStream).ReadToEndAsync();

        if (context.Response.StatusCode >= 400)
        {
            string message = context.Items.ContainsKey(ErrorMessageKey)
                ? context.Items[ErrorMessageKey]?.ToString()
                : TryExtractMessageFromBody(responseBody)
                    ?? context.Response.StatusCode switch
                    {
                        (int)HttpStatusCode.Forbidden => "You do not have permission to perform this action.",
                        (int)HttpStatusCode.Unauthorized => "Authentication is required to access this resource.",
                        (int)HttpStatusCode.BadRequest => "The request was invalid or cannot be served.",
                        _ => $"An error occurred. Status code: {context.Response.StatusCode}"
                    };

            context.Response.Body = originalBody;
            context.Response.ContentType = "application/json";
            var result = JsonSerializer.Serialize(new { message });
            await context.Response.WriteAsync(result);
        }
        else
        {
            memStream.Seek(0, SeekOrigin.Begin);
            await memStream.CopyToAsync(originalBody);
        }
    }

    private string? TryExtractMessageFromBody(string responseBody)
    {
        try
        {
            using var doc = JsonDocument.Parse(responseBody);
            if (doc.RootElement.TryGetProperty("message", out var messageProp))
            {
                return messageProp.GetString();
            }
        }
        catch
        {
            // Ignore parsing errors
        }
        return null;
    }

    // Helper to set a dynamic error message from anywhere in the pipeline
    public static void SetErrorMessage(HttpContext context, string message)
    {
        context.Items[ErrorMessageKey] = message;
    }
}
