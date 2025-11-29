using System.Net;
using System.Text.Json;
using CosmoRate.Api.Exceptions;

namespace CosmoRate.Api.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ErrorHandlingMiddleware(
            RequestDelegate next,
            ILogger<ErrorHandlingMiddleware> logger,
            IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
           
            var statusCode = (int)HttpStatusCode.InternalServerError;
            var message = "Unexpected server error occurred.";
            string? details = null;

            
            _logger.LogError(ex, "Unhandled exception");

            
            switch (ex)
            {
                case ApiException apiEx:
                    statusCode = apiEx.StatusCode;
                    message = apiEx.Message;
                    break;

                case UnauthorizedAccessException:
                    statusCode = StatusCodes.Status401Unauthorized;
                    message = "Unauthorized.";
                    break;
            }

            
            if (_env.IsDevelopment())
            {
                details = ex.StackTrace;
            }

            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";

            var error = new
            {
                status = statusCode,
                message,
                details
            };

            var json = JsonSerializer.Serialize(error);
            await context.Response.WriteAsync(json);
        }
    }
}
