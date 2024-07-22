using System.ComponentModel.DataAnnotations;

namespace EmployeeDirectory.Concerns
{
    public class Role
    {
        public Role(string roleName, string department, string location, string? description, int id)
        {
            RoleName = roleName;
            Department = department;
            Location = location;
            Description = description;
            Id = id;
        }
        [Key]
        public int Id { get; set; }
        public string RoleName { get; set; }
        public string Department { get; set; }
        public string Location { get; set; }
        public string? Description { get; set; }
    }
}
