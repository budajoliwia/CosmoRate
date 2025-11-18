using System.ComponentModel.DataAnnotations;

namespace CosmoRate.Api.DTOs;

public class AuthLoginDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}
