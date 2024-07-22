using System;
using System.Collections.Generic;

namespace EmployeeDirectory.Repository.ScaffoldData.DataConcerns;

public partial class Location
{
    public int Id { get; set; }

    public string City { get; set; } = null!;

    public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();

    public virtual ICollection<Role> Roles { get; set; } = new List<Role>();
}
