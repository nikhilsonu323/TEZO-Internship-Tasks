namespace EmployeeDirectory.Concerns
{
    public class Employee
    {
        public required string EmpNo { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string Location { get; set; }

        public int RoleId { get; set; }
        public Role? Role { get; set; }

        public string? ManagerId { get; set; }
        public Employee? Manager { get; set; }

        public string? MobileNumber { get; set; }
        public string? Project { get; set; }

        public DateOnly? DateOfBirth { get; set; }
        public DateOnly JoiningDate { get; set; }
    }
}
