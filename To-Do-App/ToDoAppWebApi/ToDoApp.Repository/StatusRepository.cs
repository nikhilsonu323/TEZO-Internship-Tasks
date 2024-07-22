using Microsoft.EntityFrameworkCore;
using ToDoApp.Repository.Data;
using ToDoApp.Repository.Data.Models;
using ToDoApp.Repository.Interfaces;

namespace ToDoApp.Repository
{
    public class StatusRepository : IStatusRepository
    {
        private ToDoAppContext _dbContext;

        public StatusRepository(ToDoAppContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddAsync(Status status)
        {
            _dbContext.Add(status);
            await _dbContext.SaveChangesAsync();
        }

        public Task<List<Status>> GetStatuses()
        {
            return _dbContext.Statuses.ToListAsync();
        }
    }
}
