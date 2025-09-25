using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using TKDHubAPI.Application.Interfaces;
using TKDHubAPI.Application.DTOs.BlogPost;
using TKDHubAPI.Domain.Entities;
using TKDHubFunctions.Helpers;

namespace TKDHubFunctions.Functions;

public class BlogPostsFunction
{
    private readonly ILogger<BlogPostsFunction> _logger;
    private readonly IBlogPostService _blogPostService;

    public BlogPostsFunction(ILogger<BlogPostsFunction> logger, IBlogPostService blogPostService)
    {
        _logger = logger;
        _blogPostService = blogPostService;
    }

    [Function("GetAllBlogPosts")]
    public async Task<HttpResponseData> GetAllBlogPosts(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "BlogPosts")] HttpRequestData req)
    {
        try
        {
            _logger.LogInformation("Getting all blog posts");

            var blogPosts = await _blogPostService.GetAllAsync();
            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(blogPosts);

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all blog posts");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Failed to get blog posts" });
            return errorResponse;
        }
    }

    [Function("GetBlogPostById")]
    public async Task<HttpResponseData> GetBlogPostById(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "BlogPosts/{id:int}")] HttpRequestData req,
        int id)
    {
        try
        {
            _logger.LogInformation($"Getting blog post with ID: {id}");

            var blogPost = await _blogPostService.GetByIdAsync(id);
            if (blogPost == null)
            {
                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                CorsHelper.SetCorsHeaders(notFoundResponse);
                await notFoundResponse.WriteAsJsonAsync(new { message = $"Blog post with ID {id} not found" });
                return notFoundResponse;
            }

            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(blogPost);

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error getting blog post with ID: {id}");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Failed to get blog post" });
            return errorResponse;
        }
    }

    [Function("CreateBlogPost")]
    public async Task<HttpResponseData> CreateBlogPost(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "BlogPosts")] HttpRequestData req)
    {
        try
        {
            _logger.LogInformation("Creating new blog post");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var createDto = System.Text.Json.JsonSerializer.Deserialize<CreateBlogPostDto>(requestBody);

            if (createDto == null)
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(new { message = "Invalid blog post data" });
                return badRequestResponse;
            }

            // TODO: Extract authorId and userRoles from JWT token when authentication is implemented
            var authorId = 1; // Default author for now
            var userRoles = new List<string> { "Admin" }; // Default role for now

            var blogPost = await _blogPostService.CreateAsync(createDto, authorId, userRoles);
            var response = req.CreateResponse(HttpStatusCode.Created);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(blogPost);

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating blog post");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Failed to create blog post" });
            return errorResponse;
        }
    }

    [Function("UpdateBlogPost")]
    public async Task<HttpResponseData> UpdateBlogPost(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "BlogPosts/{id:int}")] HttpRequestData req,
        int id)
    {
        try
        {
            _logger.LogInformation($"Updating blog post with ID: {id}");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var updateDto = System.Text.Json.JsonSerializer.Deserialize<CreateBlogPostDto>(requestBody);

            if (updateDto == null)
            {
                var badRequestResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                CorsHelper.SetCorsHeaders(badRequestResponse);
                await badRequestResponse.WriteAsJsonAsync(new { message = "Invalid blog post data" });
                return badRequestResponse;
            }

            // TODO: Extract authorId and userRoles from JWT token when authentication is implemented
            var authorId = 1; // Default author for now
            var userRoles = new List<string> { "Admin" }; // Default role for now

            var blogPost = await _blogPostService.UpdateAsync(id, updateDto, authorId, userRoles);

            if (blogPost == null)
            {
                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                CorsHelper.SetCorsHeaders(notFoundResponse);
                await notFoundResponse.WriteAsJsonAsync(new { message = $"Blog post with ID {id} not found or unauthorized" });
                return notFoundResponse;
            }

            var response = req.CreateResponse(HttpStatusCode.OK);
            CorsHelper.SetCorsHeaders(response);
            await response.WriteAsJsonAsync(blogPost);

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error updating blog post with ID: {id}");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Failed to update blog post" });
            return errorResponse;
        }
    }

    [Function("DeleteBlogPost")]
    public async Task<HttpResponseData> DeleteBlogPost(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "BlogPosts/{id:int}")] HttpRequestData req,
        int id)
    {
        try
        {
            _logger.LogInformation($"Deleting blog post with ID: {id}");

            // TODO: Extract authorId and userRoles from JWT token when authentication is implemented
            var authorId = 1; // Default author for now
            var userRoles = new List<string> { "Admin" }; // Default role for now

            var deleted = await _blogPostService.DeleteAsync(id, authorId, userRoles);

            if (!deleted)
            {
                var notFoundResponse = req.CreateResponse(HttpStatusCode.NotFound);
                CorsHelper.SetCorsHeaders(notFoundResponse);
                await notFoundResponse.WriteAsJsonAsync(new { message = $"Blog post with ID {id} not found or unauthorized" });
                return notFoundResponse;
            }

            var response = req.CreateResponse(HttpStatusCode.NoContent);
            CorsHelper.SetCorsHeaders(response);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error deleting blog post with ID: {id}");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            CorsHelper.SetCorsHeaders(errorResponse);
            await errorResponse.WriteAsJsonAsync(new { message = "Failed to delete blog post" });
            return errorResponse;
        }
    }

    [Function("BlogPostsOptions")]
    public HttpResponseData BlogPostsOptions(
        [HttpTrigger(AuthorizationLevel.Anonymous, "options", Route = "BlogPosts/{*route}")] HttpRequestData req)
    {
        return CorsHelper.CreateCorsResponse(req);
    }
}
