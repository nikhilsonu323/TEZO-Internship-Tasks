using System.ComponentModel.DataAnnotations;

namespace EmployeeDirectory.Repository.Data.DataConcerns
{
    public class RoleData
    {
        [Key]
        public int Id { get; set; }
        public string RoleName { get; set; }
        public int DepartmentId { get; set; }
        public Department Department { get; set; }
        public int LocationId { get; set; }
        public Location Location { get; set; }
        public string? Description { get; set; }
    }
}
