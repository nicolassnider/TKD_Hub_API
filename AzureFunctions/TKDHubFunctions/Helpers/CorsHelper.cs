using Microsoft.Azure.Functions.Worker.Http;
using System.Net;

namespace TKDHubFunctions.Helpers;

public static class CorsHelper
{
    public static void SetCorsHeaders(HttpResponseData response)
    {
        response.Headers.Add("Access-Control-Allow-Origin", "*");
        response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }
    
    public static HttpResponseData CreateCorsResponse(HttpRequestData request)
    {
        var response = request.CreateResponse(HttpStatusCode.OK);
        SetCorsHeaders(response);
        return response;
    }
}
