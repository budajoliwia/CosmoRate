namespace CosmoRate.Api.Services
{
    public interface ILogService
    {
        Task LogAsync(int? userId, string action, string details);
    }
}

