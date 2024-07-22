using EmployeeDirectory.Repository.Data;
using EmployeeDirectory.Repository.Data.DataConcerns;
using EmployeeDirectory.Repository.Interfaces;

namespace EmployeeDirectory.Repository
{
    public class RoleRepo : IRoleRepo
    {
        private readonly EmployeeDbContext _dbContext;
        public RoleRepo(EmployeeDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public void Add(RoleData role)
        {
            _dbContext.Roles.Add(role);
            _dbContext.SaveChanges();
        }

        public bool DeleteRole(int id)
        {
            var role = _dbContext.Roles.FirstOrDefault(role => role.Id == id);
            if(role == null) return false;
            _dbContext.Roles.Remove(role);
            _dbContext.SaveChanges();
            return true;
        }

        public List<RoleData> GetAll()
        {
            return _dbContext.Roles.ToList();
        }

        public RoleData? GetById(int id)
        {
            return _dbContext.Roles.FirstOrDefault(role => role.Id == id);
        }
    }
}
