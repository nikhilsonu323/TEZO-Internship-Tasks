using EmployeeDirectory.Concerns;
using EmployeeDirectory.Concerns.Interfaces;
using EmployeeDirectory.Repository.Interfaces;
using EmployeeDirectory.Services.Utilities;

namespace EmployeeDirectory.Services
{
    public class EmployeeServices : IEmployeeServices
    {
        private readonly IEmployeeRepo _employeeRepo;
        public EmployeeServices(IEmployeeRepo employeeRepo)
        {
            _employeeRepo = employeeRepo;
        }

        public bool AddEmployee(EmployeeDTO employee)
        {
            var emp = Mapper.MapToEmployee(employee);
            return _employeeRepo.Add(emp);
        }

        public bool UpdateEmployee(EmployeeDTO employee)
        {
            return _employeeRepo.Update(Mapper.MapToEmployee(employee));
        }

        public List<EmployeeDTO> GetEmployees()
        {
            var employees = _employeeRepo.GetAll();
            return Mapper.MapToEmployeeDTO(employees);
        }

        public EmployeeDTO? GetEmployee(string id)
        {
            var employee = _employeeRepo.GetById(id);
            if (employee == null) return null;
            return Mapper.MapToEmployeeDTO(employee);
        }

        public bool DeleteEmployee(string id)
        {
            return _employeeRepo.RemoveById(id);
        }

        public List<EmployeeDTO> GetFilterEmployees(EmployeeFilters filterData)
        {
            return Mapper.MapToEmployeeDTO(_employeeRepo.GetFilterEmployees(filterData));
        }

        public List<Manager> GetManagers()
        {
            return _employeeRepo.GetManagers();
        }

        public List<EmployeeDTO> GetEmployeesInRole(int roled)
        {
            return Mapper.MapToEmployeeDTO(_employeeRepo.GetEmployeesInRole(roled));
        }

        public void UpdateEmployeesRole(List<string> employeeIds, int roleId)
        {
            _employeeRepo.UpdateEmployeesRole(employeeIds, roleId);
        }
    }
}
