using System;
using System.Collections.Generic;

namespace EmployeeDirectory.Repository.ScaffoldData.DataConcerns;

public partial class User
{
    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string ImageData { get; set; } = null!;
}
