using System.ComponentModel.DataAnnotations;

namespace CosmoRate.Api.DTOs;

public class CreateProductDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Brand { get; set; } = string.Empty;

    [Required]
    public int CategoryId { get; set; }
}
