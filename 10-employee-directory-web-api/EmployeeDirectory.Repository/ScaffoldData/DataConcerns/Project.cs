﻿using System;
using System.Collections.Generic;

namespace EmployeeDirectory.Repository.ScaffoldData.DataConcerns;

public partial class Project
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
