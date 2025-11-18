using System.ComponentModel.DataAnnotations;

namespace CosmoRate.Api.DTOs;
//model wejściowy do rejestracji
public class AuthRegisterDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
    [MaxLength(100)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [StringLength(30, ErrorMessage = "Username cannot be longer than 30 characters.")]
    public string Username { get; set; } = string.Empty;

}
