using System.ComponentModel.DataAnnotations;

namespace EmployeeDirectory.Repository.Data.DataConcerns
{
    public class EmployeeData
    {
        [Key]
        public required string EmpNo { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string Location { get; set; }

        public int RoleId { get; set; }
        public RoleData Role { get; set; } = null!;

        public string? ManagerId { get; set; }
        public EmployeeData? Manager { get; set; }

        public string? MobileNumber { get; set; }
        public string? Project { get; set; }

        public DateOnly? DateOfBirth { get; set; }
        public DateOnly JoiningDate { get; set; }
    }
}
