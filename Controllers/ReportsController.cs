using CosmoRate.Api.Data;
using CosmoRate.Api.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CosmoRate.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles ="Admin")] //raport tylko dla admina

public class ReportsController: ControllerBase
{
    private readonly AppDbContext _db;

    public ReportsController(AppDbContext db)
    {
        _db = db;
    }

    //GET /api/reports/summary
    [Authorize(Roles ="Admin")]
    [HttpGet("summary")]

    public async Task<IActionResult> GetSummary()
    {
        var totalUsers = await _db.Users.CountAsync();
        var totalProducts = await _db.Products.CountAsync();
        var totalCategories = await _db.Categories.CountAsync();

        var totalReviews = await _db.Reviews.CountAsync();
        var pendingReviews = await _db.Reviews.CountAsync(r => r.Status == "Pending");
        var approvedReviews = await _db.Reviews.CountAsync(r => r.Status == "Approved");
        var rejectedReviews = await _db.Reviews.CountAsync(r => r.Status == "Rejected");

        var lastLogs = await _db.Logs
            .OrderByDescending(l => l.Timestamp)
            .Take(10)
            .Select(l => new LogItemDto
            {
                Id = l.Id,
                UserId = l.UserId,
                Action = l.Action,
                Details = l.Details,
                Timestamp = l.Timestamp
            })
            .ToListAsync();

        var result = new ReportsSummaryDto
        {
            Users = totalUsers,
            Products = totalProducts,
            Categories = totalCategories,
            Reviews = new ReviewSummary
            {
                Total = totalReviews,
                Pending = pendingReviews,
                Approved = approvedReviews,
                Rejected = rejectedReviews
            },
            LastLogs = lastLogs
        };

        return Ok(result);
    }
}

