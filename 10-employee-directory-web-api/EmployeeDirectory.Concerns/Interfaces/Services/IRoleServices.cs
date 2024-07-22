using EmployeeDirectory.Concerns.DTO_s;

namespace EmployeeDirectory.Concerns.Interfaces
{
    public interface IRoleServices
    {
        int AddRole(AddRole role);
        
        bool EditRole(AddRole role, int id);

        List<RoleDTO> GetRoles();

        RoleDTO? GetRole(int id);

        bool DeleteRole(int id);

        List<RoleDTO> GetRoleInDepartment(int departmntId);

        List<RoleDTO> GetFilteredRoles(RoleFiters filters);

        RoleDTO? GetRoleWithEmployees(int roleId);
        List<RoleDTO> GetRolesWithEmployees();
    }
}
