namespace CosmoRate.Api.DTOs;

public class CreateReviewDto
{
    public int ProductId { get; set; }
    public string Title { get; set; } = "";
    public string Body { get; set; } = "";
    public int Rating { get; set; }  // 1–5
}
