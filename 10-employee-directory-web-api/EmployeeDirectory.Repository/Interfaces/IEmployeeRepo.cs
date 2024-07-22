using EmployeeDirectory.Concerns;
using EmployeeDirectory.Repository.ScaffoldData.DataConcerns;

namespace EmployeeDirectory.Repository.Interfaces
{
    public interface IEmployeeRepo
    {
        bool Add(Employee employee);
        List<Employee> GetAll();
        Employee? GetById(string id);
        bool RemoveById(string id);
        bool Update(Employee newEmployeeDetails);
        List<Employee> GetFilterEmployees(EmployeeFilters filterData);
        List<Manager> GetManagers();
        List<Employee> GetEmployeesInRole(int roleId);
        void UpdateEmployeesRole(List<string> employeeIds, int roleId);
    }
}