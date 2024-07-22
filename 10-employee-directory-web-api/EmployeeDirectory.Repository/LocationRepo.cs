using EmployeeDirectory.Repository.ScaffoldData;
using EmployeeDirectory.Repository.ScaffoldData.DataConcerns;
using EmployeeDirectory.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EmployeeDirectory.Repository
{
    public class LocationRepo : ILocationRepo
    {
        private readonly EmployeesDbContext _dbContext;
        public LocationRepo(EmployeesDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async void Add(Location location)
        {
            _dbContext.Locations.Add(location);
            await _dbContext.SaveChangesAsync();
        }

        public bool IsIdExists(int id)
        {
            return _dbContext.Locations.FirstOrDefault(loc => loc.Id == id) != null;
        }

        public async Task<List<Location>> Get()
        {
            return await _dbContext.Locations.ToListAsync();
        }

        public async Task<List<Location>> GetFiltered(HashSet<int>? statusId, HashSet<int>? departmentId)
        {
            return await _dbContext.Employees
                .Include(e => e.Status)
                .Include(e => e.Role)
                .ThenInclude(role => role.Department)
                .Where(emp =>
                    (statusId == null || statusId.Count == 0 || statusId.Contains(emp.StatusId)) &&
                    (departmentId == null || departmentId.Count == 0 || departmentId.Contains(emp.Role.DepartmentId)))
                .Select(emp => emp.Location).ToListAsync();
        }

        public bool Remove(int id)
        {
            var loc = _dbContext.Locations.Find(id);
            if (loc == null) { return false; }
            _dbContext.Locations.Remove(loc);
            return true;
        }
    }
}
