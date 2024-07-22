namespace EmployeeDirectory.Concerns;

public class RoleDTO
{
    public int Id { get; set; }

    public required string RoleName { get; set; }

    public int DepartmentId { get; set; }
    public required string? Department { get; set; }


    public int LocationId { get; set; }

    public required string? Location { get; set; }

    public string? Description { get; set; }

    public ICollection<EmployeeDTO>? Employees { get; set; } = null;
}