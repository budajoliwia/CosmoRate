using CosmoRate.Api.Data;
using CosmoRate.Api.DTOs;
using CosmoRate.Api.Models;
using CosmoRate.Api.Services;
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
    private readonly ILogService _logger;
    public ReviewsController(AppDbContext db, ILogService logger)
    {
        _db = db;
        _logger = logger;
    }

    // GET /api/Reviews/product/5  -> zwraca tylko Approved
    [HttpGet("product/{productId:int}")]
    [AllowAnonymous]
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
    public async Task<ActionResult<Review>> Create([FromBody] CreateReviewDto dto)

    {
        if (dto == null) return BadRequest("Body is required.");
        if (dto.Rating < 1 || dto.Rating > 5) return BadRequest("Rating must be 1..5.");
        if (string.IsNullOrWhiteSpace(dto.Title)) return BadRequest("Title is required.");
        if (string.IsNullOrWhiteSpace(dto.Body)) return BadRequest("Body is required.");

        // czy produkt istnieje
        var productOk = await _db.Products.AnyAsync(p => p.Id == dto.ProductId);
        if (!productOk) return BadRequest("Invalid productId.");

        // UserId z tokena
        var userIdClaim =
            User.FindFirst("sub") ??
            User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
            return Unauthorized("User id is not found in token.");

        int userId = int.Parse(userIdClaim.Value);

        var review = new Review
        {
            ProductId = dto.ProductId,
            Title = dto.Title,
            Body = dto.Body,
            Rating = dto.Rating,
            UserId = userId,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };



        _db.Reviews.Add(review);
        await _db.SaveChangesAsync();

        await _logger.LogAsync(userId, "AddReview", $"ReviewId={review.Id}");

        return CreatedAtAction(nameof(GetForProduct), new { productId = review.ProductId }, review);
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

        //LOG 
        var adminId = int.Parse(
            User.FindFirst("sub")?.Value ??
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );
        await _logger.LogAsync(adminId, "ApproveReview", $"ReviewId={rev.Id}");

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

        //LOG 
        var adminId = int.Parse(
       User.FindFirst("sub")?.Value ??
       User.FindFirst(ClaimTypes.NameIdentifier)!.Value
   );

        await _logger.LogAsync(adminId, "RejectReview", $"ReviewId={rev.Id}");

        return NoContent();
    }
    // GET /api/Reviews/pending  -> recenzje w statusie Pending (dla admina)
    [Authorize(Roles = "Admin")]
    [HttpGet("pending")]
    public async Task<IActionResult> GetPending()
    {
        var items = await _db.Reviews
            .Where(r => r.Status == "Pending")
            .OrderBy(r => r.CreatedAt)
            .Select(r => new
            {
                r.Id,
                r.ProductId,
                r.UserId,
                r.Rating,
                r.Title,
                r.Body,
                r.Status,
                r.CreatedAt
            })
            .ToListAsync();

        return Ok(items);
    }
    // DELETE /api/reviews/10  -> usuń własną recenzję w statusie Pending
    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteMyReview(int id)
    {
        var userIdClaim =
            User.FindFirst("sub") ??
            User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
            return Unauthorized("User id is not found in token.");

        int userId = int.Parse(userIdClaim.Value);

        var review = await _db.Reviews
            .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

        if (review == null)
            return NotFound("Review not found.");

        if (review.Status != "Pending")
            return BadRequest("Można usunąć tylko recenzje w statusie Pending.");

        _db.Reviews.Remove(review);
        await _db.SaveChangesAsync();

        await _logger.LogAsync(userId, "DeleteReview", $"ReviewId={id}");

        return NoContent();
    }




    // GET /api/Reviews/my  -> recenzje zalogowanego użytkownika
    [Authorize]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyReviews()
    {
        var userIdClaim =
            User.FindFirst("sub") ??
            User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
            return Unauthorized("User id is not found in token.");

        int userId = int.Parse(userIdClaim.Value);

        var items = await _db.Reviews
            .Include(r => r.Product)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new
            {
                r.Id,
                r.ProductId,
                ProductName = r.Product != null ? r.Product.Name : null,
                r.Rating,
                r.Title,
                r.Body,
                r.Status,
                r.CreatedAt
            })
            .ToListAsync();

        return Ok(items);
    }
}
