using System;
using System.Collections.Generic;

namespace ToDoApp.Repository.Data.Models;

public partial class Status
{
    public int StatusId { get; set; }

    public string StatusName { get; set; } = null!;

    public virtual ICollection<ToDoTask> Tasks { get; set; } = new List<ToDoTask>();
}
