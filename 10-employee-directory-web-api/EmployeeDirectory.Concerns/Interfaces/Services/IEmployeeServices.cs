namespace EmployeeDirectory.Concerns.Interfaces
{
    public interface IEmployeeServices
    {
        bool AddEmployee(EmployeeDTO employee);

        bool UpdateEmployee(EmployeeDTO employee);

        bool DeleteEmployee(string id);

        List<EmployeeDTO> GetEmployees();

        EmployeeDTO? GetEmployee(string id);

        List<EmployeeDTO> GetFilterEmployees(EmployeeFilters filterData);

        List<Manager> GetManagers();

        List<EmployeeDTO> GetEmployeesInRole(int roleId);

        void UpdateEmployeesRole(List<string> employeeIds,int roleId);
    }
}