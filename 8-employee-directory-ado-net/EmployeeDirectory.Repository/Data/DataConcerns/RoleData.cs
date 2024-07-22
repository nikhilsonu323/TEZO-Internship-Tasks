using System.ComponentModel.DataAnnotations;

namespace EmployeeDirectory.Repository.Data.DataConcerns
{
    public class RoleData
    {
        [Key]
        public int Id { get; set; }
        public required string RoleName { get; set; }
        public required string Department { get; set; }
        public required string Location { get; set; }
        public string? Description { get; set; }
    }
}
