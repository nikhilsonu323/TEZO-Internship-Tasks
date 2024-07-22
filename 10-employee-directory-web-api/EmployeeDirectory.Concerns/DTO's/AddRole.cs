namespace EmployeeDirectory.Concerns.DTO_s;

public class AddRole
{
    public required string RoleName { get; set; }

    public int DepartmentId { get; set; }

    public int LocationId { get; set; }

    public string? Description { get; set; }

    public required List<string> EmployeeIds { get; set; }
}