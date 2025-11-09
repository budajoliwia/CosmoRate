using CosmoRate.Api.Data;
using CosmoRate.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;


namespace CosmoRate.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly AppDbContext _db;
    public ReviewsController(AppDbContext db) => _db = db;

    // GET /api/Reviews/product/5  -> zwraca tylko Approved
    [HttpGet("product/{productId:int}")]
    public async Task<IActionResult> GetForProduct(int productId)
    {
        var exists = await _db.Products.AnyAsync(p => p.Id == productId);
        if (!exists) return NotFound("Product not found.");

        var items = await _db.Reviews
            .Where(r => r.ProductId == productId && r.Status == "Approved")
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new
            {
                r.Id,
                r.Rating,
                r.Title,
                r.Body,
                r.CreatedAt,
                r.UserId
            })
            .ToListAsync();

        return Ok(items);
    }

    // POST /api/Reviews  -> tworzy recenzję w statusie Pending
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Review>> Create([FromBody] Review r)
    {
        var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();
        var userId = int.Parse(userIdClaim.Value);

        if (r == null) return BadRequest("Body is required.");
        if (r.Rating < 1 || r.Rating > 5) return BadRequest("Rating must be 1..5.");
        if (string.IsNullOrWhiteSpace(r.Title)) return BadRequest("Title is required.");
        if (string.IsNullOrWhiteSpace(r.Body)) return BadRequest("Body is required.");

        var productOk = await _db.Products.AnyAsync(p => p.Id == r.ProductId);
        if (!productOk) return BadRequest("Invalid productId.");

        
        r.UserId = userId;
        r.Status = "Pending";
        r.CreatedAt = DateTime.UtcNow;

        _db.Reviews.Add(r);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetForProduct), new { productId = r.ProductId }, r);
    }

    // PUT /api/Reviews/10/approve  -> zmiana statusu na Approved
    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}/approve")]
    public async Task<IActionResult> Approve(int id)
    {
        var rev = await _db.Reviews.FindAsync(id);
        if (rev == null) return NotFound();

        rev.Status = "Approved";
        await _db.SaveChangesAsync();

        return NoContent();
    }

    // PUT /api/Reviews/10/reject  -> zmiana statusu na Rejected
    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}/reject")]
    public async Task<IActionResult> Reject(int id)
    {
        var rev = await _db.Reviews.FindAsync(id);
        if (rev == null) return NotFound();

        rev.Status = "Rejected";
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
