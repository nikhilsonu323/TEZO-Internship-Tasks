using Microsoft.Data.SqlClient;
using Serilog;
using System.Security.Claims;

namespace ToDoAppWebApi.Middlewares
{
    public class ExceptionHandlingMiddleware : IMiddleware
    {
        private readonly IWebHostEnvironment _env;

        public ExceptionHandlingMiddleware(IWebHostEnvironment env)
        {
            _env = env;
        }
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next.Invoke(context);
            }
            catch(SqlException exception)
            {
                await HandleExcetionAsync(exception, context, "Database_Error");
            }
            catch (Exception exception)
            {
                await HandleExcetionAsync(exception, context);
            }
        }

        private async Task HandleExcetionAsync(Exception? exception, HttpContext context, string? errorMessage = null)
        {
            context.Response.StatusCode = 500;
            await context.Response.WriteAsync(errorMessage ?? exception!.Message);
            errorMessage = GetErrorMessage(exception);
            await context.Response.WriteAsync(errorMessage);
            if (_env.IsDevelopment())
            {
                LogError(context, errorMessage);
            }
        }

        private string GetErrorMessage(Exception? exception)
        {
            string errorMessage = "";
            while (exception != null)
            {
                errorMessage += exception.Message + "\n";
                exception = exception.InnerException;
            }
            return errorMessage;
        }

        private void LogError(HttpContext content, string errorMessage)
        {
            var userId = GetUserId(content);
            var errorLog = new
            {
                message = errorMessage,
                user = userId,
                endPoint = content.GetEndpoint()?.DisplayName
            };

            Log.Error("{@errorLog}", errorLog);
        }

        private string? GetUserId(HttpContext content)
        {
            var userIdString = content.User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)?.Value;
            return userIdString;
        }
    }
}
