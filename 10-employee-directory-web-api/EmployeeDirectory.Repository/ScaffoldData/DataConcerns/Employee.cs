using System;
using System.Collections.Generic;

namespace EmployeeDirectory.Repository.ScaffoldData.DataConcerns;

public partial class Employee
{
    public string EmpNo { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public int LocationId { get; set; }

    public int RoleId { get; set; }

    public string? ManagerId { get; set; }

    public int StatusId { get; set; }

    public string? MobileNumber { get; set; }

    public int? ProjectId { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public DateOnly JoiningDate { get; set; }

    public string? ImageData { get; set; }

    public virtual ICollection<Employee> InverseManager { get; set; } = new List<Employee>();

    public virtual Location Location { get; set; } = null!;

    public virtual Employee? Manager { get; set; }

    public virtual Project? Project { get; set; }

    public virtual Role Role { get; set; } = null!;

    public virtual Status Status { get; set; } = null!;
}
