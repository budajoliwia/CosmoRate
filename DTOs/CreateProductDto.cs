namespace CosmoRate.Api.DTOs;

public class CreateProductDto
{
    public string Name { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public int CategoryId { get; set; }
}
