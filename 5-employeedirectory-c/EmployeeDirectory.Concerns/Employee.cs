namespace EmployeeDirectory.Concerns
{
    public class Employee
    {
        public required string EmpNo { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string JobTitle { get; set; }
        public required string Department { get; set; }
        public required string Location { get; set; }
        public string MobileNumber { get; set; } = String.Empty;
        public string ManagerId { get; set; } = String.Empty;
        public string Project { get; set; } = String.Empty;
        public DateOnly? DateOfBirth { get; set; } = null;
        public DateOnly JoiningDate { get; set; }
    }
}
