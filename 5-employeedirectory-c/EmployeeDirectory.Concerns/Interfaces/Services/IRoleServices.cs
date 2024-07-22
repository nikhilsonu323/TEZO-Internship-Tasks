namespace EmployeeDirectory.Concerns.Interfaces
{
    public interface IRoleServices
    {
        void AddRole();
        void AddRoleInDepartment(string department);
        void DisplayAll();
        void ShowRoleServices();
        List<string> GetRolesByDepartment(string department);
    }
}