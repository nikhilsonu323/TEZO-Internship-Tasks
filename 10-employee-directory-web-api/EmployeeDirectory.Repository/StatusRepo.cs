using EmployeeDirectory.Repository.ScaffoldData;
using EmployeeDirectory.Repository.ScaffoldData.DataConcerns;
using EmployeeDirectory.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EmployeeDirectory.Repository
{
    public class StatusRepo : IStatusRepo
    {
        private readonly EmployeesDbContext _dbContext;
        public StatusRepo(EmployeesDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async void Add(Status status)
        {
            _dbContext.Statuses.Add(status);
            await _dbContext.SaveChangesAsync();
        }

        public bool IsIdExists(int id)
        {
            return _dbContext.Statuses.FirstOrDefault(s => s.Id == id) != null;
        }

        public async Task<List<Status>> Get()
        {
            return await _dbContext.Statuses.ToListAsync();
        }

        public bool Remove(int id)
        {
            var status = _dbContext.Statuses.Find(id);
            if (status == null) { return false; }
            _dbContext.Statuses.Remove(status);
            return true;
        }
    }
}
