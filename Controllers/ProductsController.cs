using CosmoRate.Api.Data;
using CosmoRate.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CosmoRate.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _db;
    public ProductsController(AppDbContext db) => _db = db;

    // GET /api/Products
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetAll()
    {
        var items = await _db.Products
            .Include(p => p.Category)
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Brand,
                Category = p.Category != null ? p.Category.Name : null
            })
            .ToListAsync();

        return Ok(items);
    }

    // GET /api/Products/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<object>> GetById(int id)
    {
        var p = await _db.Products
            .Include(x => x.Category)
            .Where(x => x.Id == id)
            .Select(x => new
            {
                x.Id,
                x.Name,
                x.Brand,
                CategoryId = x.CategoryId,
                Category = x.Category != null ? x.Category.Name : null
            })
            .FirstOrDefaultAsync();

        if (p == null) return NotFound();
        return Ok(p);
    }

    // POST /api/Products
    [HttpPost]
    public async Task<ActionResult<Product>> Create([FromBody] Product p)
    {
        if (p == null) return BadRequest("Body is required.");
        if (string.IsNullOrWhiteSpace(p.Name)) return BadRequest("Name is required.");
        if (string.IsNullOrWhiteSpace(p.Brand)) return BadRequest("Brand is required.");

        // kategoria musi istnieć
        var categoryExists = await _db.Categories.AnyAsync(c => c.Id == p.CategoryId);
        if (!categoryExists) return BadRequest("Invalid categoryId – category does not exist.");

        _db.Products.Add(p);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = p.Id }, p);
    }

    // PUT /api/Products/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] Product dto)
    {
        if (dto == null) return BadRequest("Body is required.");
        if (string.IsNullOrWhiteSpace(dto.Name)) return BadRequest("Name is required.");
        if (string.IsNullOrWhiteSpace(dto.Brand)) return BadRequest("Brand is required.");

        var product = await _db.Products.FindAsync(id);
        if (product == null) return NotFound();

        // jeżeli zmieniasz kategorię — sprawdź, że istnieje
        if (dto.CategoryId != product.CategoryId)
        {
            var catOk = await _db.Categories.AnyAsync(c => c.Id == dto.CategoryId);
            if (!catOk) return BadRequest("Invalid categoryId - category does not exist.");
        }

        product.Name = dto.Name;
        product.Brand = dto.Brand;
        product.CategoryId = dto.CategoryId;

        await _db.SaveChangesAsync();
        return NoContent(); // 204
    }

    // DELETE /api/Products/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null) return NotFound();

        _db.Products.Remove(product);
        await _db.SaveChangesAsync();
        return NoContent(); // 204
    }
}
