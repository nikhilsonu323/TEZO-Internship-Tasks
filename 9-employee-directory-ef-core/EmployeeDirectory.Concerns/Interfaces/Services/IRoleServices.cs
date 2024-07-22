namespace EmployeeDirectory.Concerns.Interfaces
{
    public interface IRoleServices
    {
        void AddRole();
        void DisplayAll();
        void ShowRoleServices();
        List<Role> GetRolesByDepartment(string department);
        void AddRoleInDepartment(string department);
    }
}