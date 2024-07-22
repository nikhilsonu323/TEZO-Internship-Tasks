namespace EmployeeDirectory.Concerns;

public class EmployeeDTO
{
    public required string EmpNo { get; set; }

    public required string FirstName { get; set; }

    public required string LastName { get; set; }

    public required string Email { get; set; }

    public int LocationId { get; set; }
    public string? Location { get; set; }

    public int RoleId { get; set; }
    public RoleDTO? Role { get; set; }

    public string? ManagerId { get; set; }
    public Manager? Manager { get; set; }

    public string? MobileNumber { get; set; }

    public int? ProjectId { get; set; }
    public string? Project { get; set; }

    public int StatusId { get; set; }
    public string? Status { get; set; }

    public DateOnly? DateOfBirth { get; set; }
    public required DateOnly JoiningDate { get; set; }

    public string? ImageData { get; set; }

}
