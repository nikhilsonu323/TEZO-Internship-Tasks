using EmployeeDirectory.Concerns;
using EmployeeDirectory.Repository.Data.DataConcerns;

namespace EmployeeDirectory.Services.Utilities
{
    public static class Mapper
    {
        public static Role MapToRole(RoleData roleData)
        {
            return new Role(roleData.RoleName, roleData.Department, roleData.Location, roleData.Description, roleData.Id);
        }

        public static RoleData MapToRoleData(Role role)
        {
            return new RoleData() { Department = role.Department, RoleName = role.RoleName, Description = role.Description, Location = role.Location };
        }

        public static List<Role> MapToRole(List<RoleData> rolesData)
        {
            var roles = new List<Role>();
            foreach (var roleData in rolesData)
            {
                roles.Add(MapToRole(roleData));
            }
            return roles;
        }


        public static Employee? MapToEmployee(EmployeeData? employeeData, bool isManagerRequired = true)
        {
            if (employeeData == null) return null;
            return new Employee()
            {
                EmpNo = employeeData.EmpNo,
                FirstName = employeeData.FirstName,
                LastName = employeeData.LastName,
                Email = employeeData.Email,
                Location = employeeData.Location,
                RoleId = employeeData.RoleId,
                Role = employeeData.Role != null ? MapToRole(employeeData.Role) : null,
                ManagerId = employeeData.ManagerId,
                Manager = (isManagerRequired && employeeData.Manager != null) ? MapToEmployee(employeeData.Manager, false) : null,
                MobileNumber = employeeData.MobileNumber,
                Project = employeeData.Project,
                DateOfBirth = employeeData.DateOfBirth,
                JoiningDate = employeeData.JoiningDate,
            };
        }

        public static List<Employee> MapToEmployee(List<EmployeeData> employeesData, bool isManagerRequired = true)
        {
            var employees = new List<Employee>();
            foreach (var employee in employeesData)
            {
                employees.Add(MapToEmployee(employee)!);
            }
            return employees;
        }

        public static EmployeeData MapToEmployeeData(Employee employee)
        {
            return new EmployeeData()
            {
                EmpNo = employee.EmpNo,
                FirstName = employee.FirstName,
                LastName = employee.LastName,
                Email = employee.Email,
                Location = employee.Location,
                RoleId = employee.RoleId,
                ManagerId = employee.ManagerId,
                MobileNumber = employee.MobileNumber,
                Project = employee.Project,
                DateOfBirth = employee.DateOfBirth,
                JoiningDate = employee.JoiningDate,
            };
        }
    }
}
