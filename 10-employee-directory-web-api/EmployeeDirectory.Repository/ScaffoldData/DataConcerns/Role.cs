﻿using System;
using System.Collections.Generic;

namespace EmployeeDirectory.Repository.ScaffoldData.DataConcerns;

public partial class Role
{
    public int Id { get; set; }

    public string RoleName { get; set; } = null!;

    public int DepartmentId { get; set; }

    public int LocationId { get; set; }

    public string? Description { get; set; }

    public virtual Department Department { get; set; } = null!;

    public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();

    public virtual Location Location { get; set; } = null!;
}
