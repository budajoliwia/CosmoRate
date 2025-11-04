namespace CosmoRate.Api.DTOs;
//model wejściowy do rejestracji
public class AuthRegisterDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;

}
