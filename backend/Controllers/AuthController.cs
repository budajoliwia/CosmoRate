using CosmoRate.Api.DTOs;
using CosmoRate.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;


namespace CosmoRate.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{

    private readonly IAuthService _auth;
    private readonly ILogService _logger;
    public AuthController(IAuthService auth, ILogService logger)
    {
        _auth = auth;
        _logger = logger;
    }
    // POST /api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] AuthRegisterDto dto)
    {
        var (ok, error, user) = await _auth.RegisterAsync(dto);
        if (!ok) return BadRequest(error);

        // log – nowy u¿ytkownik
        await _logger.LogAsync(
            userId: user!.Id,
            action: "Register",
            details: $"Email={user.Email}"
        );

        return CreatedAtAction(nameof(Register), new { id = user!.Id }, new
        {
            user.Id,
            user.Email,
            user.Role
        });
    }

    // POST /api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AuthLoginDto dto)
    {
        var (ok, error, token) = await _auth.LoginAsync(dto);
        if (!ok) return Unauthorized(error);

        // nieudane logowanie 
        await _logger.LogAsync(
            userId: null,
            action: "LoginFailed",
            details: $"Email={dto.Email}"
        );

        // udane logowanie
        await _logger.LogAsync(
            userId: null,                  
            action: "LoginSuccess",
            details: $"Email={dto.Email}"
        );

        return Ok(new { token });
    }

}
