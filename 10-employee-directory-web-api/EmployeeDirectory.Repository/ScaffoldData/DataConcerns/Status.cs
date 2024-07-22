using System;
using System.Collections.Generic;

namespace EmployeeDirectory.Repository.ScaffoldData.DataConcerns;

public partial class Status
{
    public int Id { get; set; }

    public string StatusType { get; set; } = null!;

    public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
