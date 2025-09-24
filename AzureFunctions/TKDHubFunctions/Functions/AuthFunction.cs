using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;


namespace TKDHubFunctions
{
    public class AuthFunction
    {
        private readonly ILogger _logger;


        public AuthFunction(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<AuthFunction>();
        }


        [Function("Login")]
        public async Task<HttpResponseData> Login(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "auth/login")]
            HttpRequestData req)
        {
            _logger.LogInformation("Login function processed a request.");


            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(new { message = "Login endpoint" });
            return response;
        }


        [Function("Register")]
        public async Task<HttpResponseData> Register(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "auth/register")]
            HttpRequestData req)
        {
            _logger.LogInformation("Register function processed a request.");


            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(new { message = "Register endpoint" });
            return response;
        }
    }
}