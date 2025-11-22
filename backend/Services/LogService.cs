using CosmoRate.Api.Data;
using CosmoRate.Api.Models;

namespace CosmoRate.Api.Services
{
    public class LogService : ILogService
    {
        private readonly AppDbContext _db;

        public LogService(AppDbContext db)
        {
            _db = db;
        }

        public async Task LogAsync(int? userId, string action, string details)
        {
            var log = new Log
            {
                UserId = userId,
                Action = action,
                Details = details,
                Timestamp = DateTime.UtcNow
            };

            _db.Logs.Add(log);
            await _db.SaveChangesAsync();
        }
    }
}
