using CosmoRate.Api.Data;
using CosmoRate.Api.DTOs;
using CosmoRate.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;


namespace CosmoRate.Api.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public async Task<(bool ok, string? error, User? user)> RegisterAsync(AuthRegisterDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || !dto.Email.Contains("@"))
            return (false, "Invalid email.", null);

        if (string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 6)
            return (false, "Password too short (min 6).", null);

        var exists = await _db.Users.AnyAsync(u => u.Email == dto.Email);
        if (exists) return (false, "Email already in use.", null);

        // UWAGA: na razie bez hashowania, żeby było prosto
        var user = new User
        {
            Email = dto.Email,
            Username = dto.Username,
            PasswordHash = dto.Password, 
            Role = "User"
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return (true, null, user);
    }

    public async Task<(bool ok, string? error, string? token)> LoginAsync(AuthLoginDto dto)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null) return (false, "Invalid credentials.", null);

        if (user.PasswordHash != dto.Password)
            return (false, "Invalid credentials.", null);

        //klucz 
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        //podpis
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        //claims - info o uzytkowniku
        var claims = new[] {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        // bodowanie tokena
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds
            );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return (true, null, tokenString);

    }
}
