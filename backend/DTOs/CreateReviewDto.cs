using System.ComponentModel.DataAnnotations;

namespace CosmoRate.Api.DTOs;

public class CreateReviewDto
{
    [Required]
    public int ProductId { get; set; }

    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
    public int Rating { get; set; }

    [Required]
    [StringLength(100)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(1000)]
    public string Body { get; set; } = string.Empty;
}
