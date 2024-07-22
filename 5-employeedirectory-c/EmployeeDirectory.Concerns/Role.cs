namespace EmployeeDirectory.Concerns
{
    public class Role
    {
        public Role(string roleName, string department, string location, string description)
        {
            RoleName = roleName;
            Department = department;
            Location = location;
            Description = description;
        }
        public string RoleName { get; set; }
        public string Department { get; set; }
        public string Location { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}
