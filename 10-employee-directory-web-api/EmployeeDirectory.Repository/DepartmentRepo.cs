using EmployeeDirectory.Repository.ScaffoldData.DataConcerns;
using EmployeeDirectory.Repository.ScaffoldData;
using Microsoft.EntityFrameworkCore;
using EmployeeDirectory.Repository.Interfaces;

namespace EmployeeDirectory.Repository
{
    public class DepartmentRepo : IDepartmentRepo
    {
        private readonly EmployeesDbContext _dbContext;
        public DepartmentRepo(EmployeesDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async void Add(Department department)
        {
            _dbContext.Departments.Add(department);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<Department>> Get()
        {
            return await _dbContext.Departments.ToListAsync();
        }

        public async Task<List<Department>> GetFiltered(HashSet<int>? statusId, HashSet<int>? locationId)
        {
            return await _dbContext.Employees
                .Include(e => e.Status)
                .Include(e => e.Role)
                .ThenInclude(role => role.Department)
                .Where(emp =>
                    (statusId == null || statusId.Count == 0 || statusId.Contains(emp.StatusId)) &&
                    (locationId == null || locationId.Count == 0 || locationId.Contains(emp.LocationId)))
                .Select(emp => emp.Role.Department).ToListAsync();
        }

        public bool Remove(int id)
        {
            var dep = _dbContext.Departments.Find(id);
            if (dep == null) { return false; }
            _dbContext.Departments.Remove(dep);
            return true;
        }

        public bool IsIdExists(int id)
        {
            return _dbContext.Departments.FirstOrDefault(dep => dep.Id == id) != null;
        }
    }
}
