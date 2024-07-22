namespace EmployeeDirectory.Concerns.DTO_s;

public class AuthResponse
{
    public required string Name { get; set; }

    public required string Email { get; set; }

    public required string ImageData { get; set; }

    public required string Token { get; set; }

    public required double ExpiresIn { get; set; }
}
