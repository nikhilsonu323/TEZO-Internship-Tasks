using EmployeeDirectory.Concerns;
using EmployeeDirectory.Concerns.DTO_s;
using EmployeeDirectory.Concerns.Interfaces;
using EmployeeDirectory.Repository.Interfaces;
using EmployeeDirectory.Services.Utilities;

namespace EmployeeDirectory.Services
{
    public class RoleServices : IRoleServices
    {
        private readonly IRoleRepo _roleRepo;

        public RoleServices(IRoleRepo roleRepo)
        {
            _roleRepo = roleRepo;
        }

        public int AddRole(AddRole role)
        {
            return _roleRepo.Add(Mapper.MapToRole(role)).Id;
        }

        public RoleDTO? GetRole(int id)
        {
            var role = Mapper.MapToRoleDTO(_roleRepo.GetById(id), true);
            return role;
        }

        public List<RoleDTO> GetRoles()
        {
            var roles = Mapper.MapToRoleDTO(_roleRepo.GetAll());
            return roles;
        }

        public bool DeleteRole(int id)
        {
            return _roleRepo.DeleteRole(id);
        }

        public List<RoleDTO> GetRoleInDepartment(int departmntId)
        {
            return Mapper.MapToRoleDTO(_roleRepo.GetRoleInDepartment(departmntId));
        }

        public List<RoleDTO> GetFilteredRoles(RoleFiters filters)
        {
            return Mapper.MapToRoleDTO(_roleRepo.GetFilteredRole(filters), true);
        }

        public RoleDTO? GetRoleWithEmployees(int roleId)
        {
            return Mapper.MapToRoleDTO(_roleRepo.GetRoleWithEmployees(roleId), true);
        }

        public List<RoleDTO> GetRolesWithEmployees()
        {
            return Mapper.MapToRoleDTO(_roleRepo.GetRolesWithEmployees(), true);
        }

        public bool EditRole(AddRole roleToAdd, int id)
        {
            var role = Mapper.MapToRole(roleToAdd);
            role.Id = id;
            role = _roleRepo.Edit(role);
            return role != null;
        }
    }
}
