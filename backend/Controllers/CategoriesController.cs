using CosmoRate.Api.Data;
using CosmoRate.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using CosmoRate.Api.Services;
using System.Security.Claims;



namespace CosmoRate.Api.Controllers;

[Authorize(Roles ="Admin")]
[ApiController]
[Route("api/[controller]")]
public class CategoriesController: ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ILogService _logger;
    public CategoriesController(AppDbContext db, ILogService logger)
    {
        _db = db;
        _logger = logger;
    }
    private int? GetUserId()
    {
        var claim = User.FindFirst("sub") ?? User.FindFirst(ClaimTypes.NameIdentifier);
        if (claim == null) return null;
        return int.Parse(claim.Value);
    }

    //GET /api/Categories
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetAll() =>
        Ok(await _db.Categories.AsNoTracking().ToListAsync());

    //GET /api/Categories/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Category>>GetById(int id)
    {
        var c = await _db.Categories.FindAsync(id);
        return c == null ? NotFound() : Ok(c);
    }

    //POST /api/Categories
    [HttpPost]
    public async Task<ActionResult<Category>> Create([FromBody] Category c)
    {
        if (c == null || string.IsNullOrWhiteSpace(c.Name))
            return BadRequest("Name id required.");

        var exist = await _db.Categories.AnyAsync(x => x.Name == c.Name);
        if (exist) return BadRequest("Category name already exist.");

        _db.Categories.Add(c);
        await _db.SaveChangesAsync();

        var userId = GetUserId();
        await _logger.LogAsync(userId, "CreateCategory", $"CategoryId={c.Id}, Name={c.Name}");

        return CreatedAtAction(nameof(GetById), new { id = c.Id }, c);
    }

    // PUT /api/categories/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] Category dto)
    {
        if (dto == null) return BadRequest("Body is required.");
        if (string.IsNullOrWhiteSpace(dto.Name)) return BadRequest("Name is required.");

        var cat = await _db.Categories.FindAsync(id);
        if (cat == null) return NotFound();

        cat.Name = dto.Name;
        await _db.SaveChangesAsync();

        var userId = GetUserId();
        await _logger.LogAsync(userId, "UpdateCategory", $"CategoryId={cat.Id}");


        return NoContent();
    }


    //DELETE /api/Categories/5
    [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var c = await _db.Categories.FindAsync(id);
            if (c == null) return NotFound();
            _db.Categories.Remove(c);
            await _db.SaveChangesAsync();

        var userId = GetUserId();
        await _logger.LogAsync(userId, "DeleteCategory", $"CategoryId={id}");

        return NoContent();
        }
    
}