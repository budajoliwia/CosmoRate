namespace CosmoRate.Api.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Brand { get; set; } = "";
    public int CategoryId { get; set; } 
    public Category? Category { get; set; }
    public string? ImageUrl { get; set; }
}
