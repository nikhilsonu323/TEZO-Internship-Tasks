using EmployeeDirectory.Repository.ScaffoldData;
using EmployeeDirectory.Repository.ScaffoldData.DataConcerns;
using EmployeeDirectory.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using EmployeeDirectory.Concerns.DTO_s;

namespace EmployeeDirectory.Repository
{
    public class RoleRepo : IRoleRepo
    {
        private readonly EmployeesDbContext _dbContext;
        public RoleRepo(EmployeesDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public Role Add(Role role)
        {
            var addedRole = _dbContext.Roles.Add(role);
            _dbContext.SaveChanges();
            return addedRole.Entity;
        }

        public bool DeleteRole(int id)
        {
            var role = _dbContext.Roles.FirstOrDefault(role => role.Id == id);
            if(role == null) return false;
            _dbContext.Roles.Remove(role);
            _dbContext.SaveChanges();
            return true;
        }

        public List<Role> GetAll()
        {
            var roles = _dbContext.Roles
                .Include(r => r.Department)
                .Include(r => r.Location)
                .Include(r => r.Employees)
                .ToList();
            return roles;
        }

        public Role? GetById(int id)
        {
            return _dbContext.Roles
                .Include(r => r.Department)
                .Include(r => r.Location)
                .Include(r => r.Employees)
                .FirstOrDefault(role => role.Id == id);
        }

        public List<Role> GetRoleInDepartment(int departmntId)
        {
            return _dbContext.Roles.Where(role => role.DepartmentId == departmntId).ToList();
        }

        public List<Role> GetFilteredRole(RoleFiters filters)
        {
            return _dbContext.Roles
                .Include(r => r.Department)
                .Include(r => r.Location)
                .Include(r => r.Employees)
                .Where(role => 
                (filters.LocationIds.Count == 0 || filters.LocationIds.Contains(role.LocationId)) &&
                (filters.DepartmentIds.Count == 0 || filters.DepartmentIds.Contains(role.DepartmentId)))
                .ToList();
        }

        public Role? GetRoleWithEmployees(int roleId)
        {
            return _dbContext.Roles
                .Include(r => r.Department)
                .Include(r => r.Location)
                .Include(r => r.Employees)
                .FirstOrDefault(role => role.Id == roleId);
        }

        public List<Role> GetRolesWithEmployees()
        {
            return _dbContext.Roles
                .Include(r => r.Department)
                .Include(r => r.Location)
                .Include(r => r.Employees)
                .ToList();
        }

        public Role? Edit(Role role)
        {
            var existingRole = _dbContext.Roles.FirstOrDefault(r => r.Id == role.Id);
            if (existingRole == null) { return null; }
            _dbContext.Entry(existingRole).State = EntityState.Detached;
            var updatedRole = _dbContext.Roles.Update(role);
            _dbContext.SaveChanges();
            return updatedRole.Entity;
        }
    }
}
