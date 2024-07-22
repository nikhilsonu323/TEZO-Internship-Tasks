using System.ComponentModel.DataAnnotations;

namespace EmployeeDirectory.Repository.Data.DataConcerns
{
    public class EmployeeData
    {
        [Key]
        public string EmpNo { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }

        public int LocationId { get; set; }
        public Location Location { get; set; }

        public int RoleId { get; set; }
        public RoleData Role { get; set; } = null!;

        public string? ManagerId { get; set; }
        public EmployeeData? Manager { get; set; }

        public int StatusId { get; set; }
        public Status Status { get; set; }

        public string? MobileNumber { get; set; }
        
        public int? ProjectId { get; set; }
        public Project? Project { get; set; }

        public DateOnly? DateOfBirth { get; set; }
        public DateOnly JoiningDate { get; set; }
    }
}
