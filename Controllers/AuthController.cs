using Microsoft.AspNetCore.Mvc;
using CosmoRate.Api.DTOs;
using CosmoRate.Api.Services;


namespace CosmoRate.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{

    private readonly IAuthService _auth;
    public AuthController(IAuthService auth)
    {
        _auth = auth;
    }
    // POST /api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] AuthRegisterDto dto)
    {
        var (ok, error, user) = await _auth.RegisterAsync(dto);
        if (!ok) return BadRequest(error);

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

        return Ok(new { token });
    }

}
