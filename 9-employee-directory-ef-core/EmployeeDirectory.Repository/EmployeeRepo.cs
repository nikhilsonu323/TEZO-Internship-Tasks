using EmployeeDirectory.Repository.Data;
using EmployeeDirectory.Repository.Data.DataConcerns;
using EmployeeDirectory.Repository.Interfaces;

using Microsoft.EntityFrameworkCore;

namespace EmployeeDirectory.Repository
{
    public class EmployeeRepo : IEmployeeRepo
    {
        private readonly EmployeeDbContext _dbContext;
        public EmployeeRepo(EmployeeDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Add(EmployeeData employee)
        {
            _dbContext.Employees.Add(employee);
            _dbContext.SaveChanges();
        }

        public List<EmployeeData> GetAll()
        {
            return _dbContext.Employees.Include(e => e.Role).Include(e => e.Manager).ToList();
        }

        public EmployeeData? GetById(string id)
        {
            var employee = _dbContext.Employees.Include(e => e.Role).Include(e => e.Manager).FirstOrDefault(emp => emp.EmpNo == id);
            return employee;
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

        public void Update(EmployeeData newEmployeeDetails)
        {
            var existingEmployee = _dbContext.Employees.Local.FirstOrDefault(e => e.EmpNo == newEmployeeDetails.EmpNo);
            if (existingEmployee != null) { _dbContext.Entry(existingEmployee).State = EntityState.Detached; }
            _dbContext.Employees.Update(newEmployeeDetails);
            _dbContext.SaveChanges();
        }
    }
}
