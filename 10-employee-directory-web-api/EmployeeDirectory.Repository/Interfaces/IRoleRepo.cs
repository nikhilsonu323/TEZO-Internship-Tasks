using EmployeeDirectory.Concerns.DTO_s;
using EmployeeDirectory.Repository.ScaffoldData.DataConcerns;

namespace EmployeeDirectory.Repository.Interfaces
{
    public interface IRoleRepo
    {
        Role Add(Role role);

        Role? Edit(Role role);

        List<Role> GetAll();

        Role? GetById(int id);

        bool DeleteRole(int id);

        List<Role> GetRoleInDepartment(int departmntId);

        List<Role> GetFilteredRole(RoleFiters filters);

        Role? GetRoleWithEmployees(int roleId);
        
        List<Role> GetRolesWithEmployees();
    }
}