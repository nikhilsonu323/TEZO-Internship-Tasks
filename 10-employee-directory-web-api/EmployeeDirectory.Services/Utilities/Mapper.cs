using EmployeeDirectory.Concerns;
using EmployeeDirectory.Concerns.DTO_s;
using EmployeeDirectory.Repository.ScaffoldData.DataConcerns;

namespace EmployeeDirectory.Services.Utilities
{
    public static class Mapper
    {
        public static RoleDTO? MapToRoleDTO(Role? role, bool includeEmployees = false)
        {
            if (role == null) return null;
            return new RoleDTO()
            {
                RoleName = role.RoleName,
                Department = role.Department?.Name,
                Location = role.Location?.City,
                Id = role.Id,
                Description = role.Description,
                LocationId = role.LocationId,
                DepartmentId = role.DepartmentId,
                Employees = includeEmployees && role.Employees != null ? MapToEmployeeDTO(role.Employees) : null
            };
        }

        public static List<RoleDTO> MapToRoleDTO(List<Role> roles, bool includeEmployees = false)
        {
            var roleDTOs = new List<RoleDTO>();
            foreach (var role in roles)
            {
                roleDTOs.Add(MapToRoleDTO(role, includeEmployees)!);
            }
            return roleDTOs;
        }

/*        public static Role MapToRoleData(RoleDTO roleDTO)
        {
            return new Role() { 
                RoleName = roleDTO.RoleName, 
                DepartmentId = roleDTO.DepartmentId, 
                Description = roleDTO.Description, 
                LocationId = roleDTO.LocationId 
            };
        }
*/
        public static Role MapToRole(AddRole addRoleDTO)
        {
            return new Role()
            {
                RoleName = addRoleDTO.RoleName,
                DepartmentId = addRoleDTO.DepartmentId,
                Description = addRoleDTO.Description,
                LocationId = addRoleDTO.LocationId
            };
        }

        public static EmployeeDTO? MapToEmployeeDTO(Employee? employee)
        {
            if (employee == null) return null;
            return new EmployeeDTO()
            {
                EmpNo = employee.EmpNo,
                FirstName = employee.FirstName,
                LastName = employee.LastName,
                Email = employee.Email,

                LocationId = employee.LocationId,
                Location = employee.Location?.City,

                RoleId = employee.RoleId,
                Role = MapToRoleDTO(employee.Role),

                ManagerId = employee.ManagerId,
                Manager = (employee.Manager != null) ? new Manager() { EmpNo = employee.Manager.EmpNo, FirstName = employee.Manager.FirstName, LastName = employee.Manager.LastName } : null,

                ProjectId = employee.ProjectId,
                Project = employee.Project?.Name,

                StatusId = employee.StatusId,
                Status = employee.Status?.StatusType,

                MobileNumber = employee.MobileNumber,
                DateOfBirth = employee.DateOfBirth,
                JoiningDate = employee.JoiningDate,

                ImageData = employee.ImageData
            };
        }

        public static List<EmployeeDTO> MapToEmployeeDTO(ICollection<Employee> employees)
        {
            var employeeDTOs = new List<EmployeeDTO>();
            foreach (var employee in employees)
            {
                employeeDTOs.Add(MapToEmployeeDTO(employee)!);
            }
            return employeeDTOs;
        }

        public static Employee MapToEmployee(EmployeeDTO employeeDTO)
        {
            return new Employee()
            {
                EmpNo = employeeDTO.EmpNo,
                FirstName = employeeDTO.FirstName,
                LastName = employeeDTO.LastName,
                Email = employeeDTO.Email,
                LocationId = employeeDTO.LocationId,
                RoleId = employeeDTO.RoleId,
                ManagerId = employeeDTO.ManagerId,
                MobileNumber = employeeDTO.MobileNumber,
                ProjectId = employeeDTO.ProjectId,
                DateOfBirth = employeeDTO.DateOfBirth,
                JoiningDate = employeeDTO.JoiningDate,
                StatusId = employeeDTO.StatusId,
                ImageData = employeeDTO.ImageData
            };
        }

        public static User MapToUser(AddUserDTO userDTO)
        {
            return new User()
            {
                Name = userDTO.Name,
                Email = userDTO.Email,
                Password = userDTO.Password,
                ImageData = userDTO.ImageData,
            };
        }
    }
}
