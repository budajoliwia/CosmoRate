using CosmoRate.Api.DTOs;
using CosmoRate.Api.Models;

namespace CosmoRate.Api.Services
{
    public interface IAuthService
    {
        Task<(bool ok, string? error, User? user)> RegisterAsync(AuthRegisterDto dto);
        Task<(bool ok, string? error, string? token)> LoginAsync(AuthLoginDto dto);
    }
}
