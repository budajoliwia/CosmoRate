namespace CosmoRate.Api.DTOs
{
    // Główna odpowiedź /api/Reports/summary
    public class ReportsSummaryDto
    {
        public int Users { get; set; }
        public int Products { get; set; }
        public int Categories { get; set; }

        public ReviewSummary Reviews { get; set; } = new ReviewSummary();
        public List<LogItemDto> LastLogs { get; set; } = new();
    }

    // Podsumowanie recenzji
    public class ReviewSummary
    {
        public int Total { get; set; }
        public int Pending { get; set; }
        public int Approved { get; set; }
        public int Rejected { get; set; }
    }

    // Pojedynczy wpis loga
    public class LogItemDto
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string Action { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
    }
}

