using EmployeeDirectory.Concerns;
using EmployeeDirectory.Repository.ScaffoldData;
using EmployeeDirectory.Repository.ScaffoldData.DataConcerns;
using EmployeeDirectory.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EmployeeDirectory.Repository
{
    public class EmployeeRepo : IEmployeeRepo
    {
        private readonly EmployeesDbContext _dbContext;
        public EmployeeRepo(EmployeesDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public bool Add(Employee employee)
        {
            if (GetById(employee.EmpNo) != null) return false;
            _dbContext.Employees.Add(employee);
            _dbContext.SaveChanges();
            return true;
        }

        public List<Employee> GetAll()
        {
            return _dbContext.Employees
                .Include(e => e.Manager)
                .Include(e => e.Location)
                .Include(e => e.Status)
                .Include(e => e.Role)
                .ThenInclude(e => e.Department)
                .ToList();
        }

        public Employee? GetById(string id)
        {
            return _dbContext.Employees
                .Include(e => e.Location)
                .Include(e => e.Status)
                .Include(e => e.Role)
                .ThenInclude(r => r.Department)
                .Include(e => e.Manager)
                .FirstOrDefault(emp => emp.EmpNo == id);
        }

        public bool RemoveById(string id)
        {
            var employee = _dbContext.Employees.FirstOrDefault(emp => emp.EmpNo == id)!;

            if (employee == null) { return false; }
            
            var employeesToUpdate = _dbContext.Employees.Where(emp => emp.ManagerId == id);
            
            foreach (var employeeToUpdate in employeesToUpdate)
                employeeToUpdate.ManagerId = null;
            
            _dbContext.Employees.Remove(employee);
            _dbContext.SaveChanges();
            return true;
        }

        public bool Update(Employee newEmployeeDetails)
        {
            var existingEmployee = _dbContext.Employees.FirstOrDefault(e => e.EmpNo == newEmployeeDetails.EmpNo);
            if(existingEmployee == null) { return false; }
            _dbContext.Entry(existingEmployee).State = EntityState.Detached;
            _dbContext.Employees.Update(newEmployeeDetails);
            _dbContext.SaveChanges();
            return true;
        }

        public List<Employee> GetFilterEmployees(EmployeeFilters filters)
        {
           return  _dbContext.Employees
                .Include(e => e.Manager)
                .Include(e => e.Location)
                .Include(e => e.Status)
                .Include(e => e.Role)
                .ThenInclude(e => e.Department)
                .Where(e =>
                (filters.Alphabets.Count == 0 || filters.Alphabets.Contains(e.FirstName.Substring(0, 1).ToUpper())) &&
                (filters.LocationIds.Count == 0 || filters.LocationIds.Contains(e.LocationId)) &&
                (filters.DepartmentIds.Count == 0 || filters.DepartmentIds.Contains(e.Role.DepartmentId)) &&
                (filters.StatusIds.Count == 0 || filters.StatusIds.Contains(e.StatusId)))
                .ToList();
        }

        public List<Manager> GetManagers()
        {
            return _dbContext.Employees
                .Select(emp => new Manager() { EmpNo = emp.EmpNo, FirstName = emp.FirstName, LastName = emp.LastName })
                .ToList();
        }

        public List<Employee> GetEmployeesInRole(int roleId)
        {
            return _dbContext.Employees
                .Include(e => e.Manager)
                .Include(e => e.Location)
                .Include(e => e.Status)
                .Include(e => e.Role)
                .ThenInclude(e => e.Department)
                .Where(e => e.RoleId == roleId)
                .ToList();
        }

        public void UpdateEmployeesRole(List<string> employeeIds, int roleId)
        {
            if (!employeeIds.Any())
            {
                return;
            }
            var employees = _dbContext.Employees.Where(emp => employeeIds.Contains(emp.EmpNo));
            foreach (var employee in employees)
            {
                employee.RoleId = roleId;
            }

            _dbContext.SaveChanges();
        }
    }
}
