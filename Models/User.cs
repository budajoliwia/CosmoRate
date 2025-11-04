namespace CosmoRate.Api.Models;

public class User
{
    public int Id { get; set; }
<<<<<<< HEAD
    public string Email { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public string Role { get; set; } = "User";

=======
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "User";

    public string Username { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

>>>>>>> f3337bb (jwt)
}

