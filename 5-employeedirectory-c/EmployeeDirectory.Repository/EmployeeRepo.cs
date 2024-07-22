using EmployeeDirectory.Concerns;
using EmployeeDirectory.Concerns.Interfaces;
using System.Text.Json;

namespace EmployeeDirectory.Repository
{
    public class EmployeeRepo : IEmployeeRepo
    {
        private readonly string _filePath;

        public EmployeeRepo()
        {
            string? path = Directory.GetParent(Directory.GetCurrentDirectory())?.Parent?.Parent?.Parent?.FullName;
            _filePath = path + "\\EmployeeDirectory.Repository\\Data source\\Employees.Json";
        }
        public void Add(Employee employee)
        {
            List<Employee> employees = GetEmployeesFromJson();
            employees.Add(employee);
            WriteEmployeesToJson(employees);
        }
        public bool RemoveById(string id)
        {
            Employee? employee = GetById(id);
            List<Employee> employeesList = GetEmployeesFromJson();
            if (employeesList.Count == 0 || employee == null) return false;
            employeesList = employeesList.Where(employee => employee.EmpNo != id).ToList();
            WriteEmployeesToJson(employeesList);
            return true;
        }
        public List<Employee> GetAll()
        {
            return GetEmployeesFromJson();
        }
        public Employee? GetById(string id)
        {
            List<Employee> employeesList = GetEmployeesFromJson();
            return employeesList.FirstOrDefault(employee => employee.EmpNo == id);
        }
        public bool IsEmployeeIdExists(string id)
        {
            List<Employee>? employeesList = GetEmployeesFromJson();
            return employeesList?.FirstOrDefault(employee => employee.EmpNo == id) != null;
        }
        public List<string> GetAllManagers()
        {
            List<Employee> employeesList = GetEmployeesFromJson();
            return (from employee in employeesList select employee.EmpNo + " - " + employee.FirstName).ToList();
        }
        public void Update(Employee newEmployeeDetails)
        {
            List<Employee> employeesList = GetEmployeesFromJson();
            if (employeesList.Count == 0) { return; }
            for (int i = 0; i < employeesList.Count; i++)
            {
                //As Id can't be changed for new or old
                if (employeesList[i].EmpNo == newEmployeeDetails.EmpNo)
                {
                    employeesList[i] = newEmployeeDetails;
                    break;
                }
            }
            WriteEmployeesToJson(employeesList);
        }

        #region Helpers
        private List<Employee> GetEmployeesFromJson()
        {
            if (!File.Exists(_filePath)) { return []; }
            string employeesJson = File.ReadAllText(_filePath);
            try { return JsonSerializer.Deserialize<List<Employee>>(employeesJson) ?? []; }
            catch { return []; }
        }
        private void WriteEmployeesToJson(List<Employee> employees)
        {
            string employeesJson = JsonSerializer.Serialize(employees);
            File.WriteAllText(_filePath, employeesJson);
        }
        #endregion
    }
}
