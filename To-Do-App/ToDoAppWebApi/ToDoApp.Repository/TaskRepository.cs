using Microsoft.EntityFrameworkCore;
using ToDoApp.Repository.Data;
using ToDoApp.Repository.Data.Models;
using ToDoApp.Repository.Interfaces;

namespace ToDoApp.Repository
{
    public class TaskRepository : ITaskRepository
    {
        private ToDoAppContext _dbContext;

        public TaskRepository(ToDoAppContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddTaskAsync(ToDoTask task)
        {
            _dbContext.Tasks.Add(task);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<bool> UpdateTaskAsync(ToDoTask task)
        {
            var existingTask = await GetTaskAsync(task.TaskId, task.UserId);
            if (existingTask == null) { return false; }

            _dbContext.Entry(existingTask).State = EntityState.Detached;

            _dbContext.Tasks.Update(task);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<ToDoTask?> GetTaskAsync(int taskId, int userId)
        {
            return await _dbContext.Tasks.Include(task => task.Status)
                .FirstOrDefaultAsync(task => task.TaskId == taskId && task.UserId == userId);
        }

        public async Task<List<ToDoTask>> GetTasksAsync(int userId, DateTime? createdOn, DateTime? completedOn, int? statusId, string? sortBy = null)
        {
            var query = _dbContext.Tasks.Include(task => task.Status)
                    .Where(task => task.UserId == userId &&
                    (createdOn == null || createdOn.Value.Date == task.CreatedOn.Date) &&
                    (completedOn == null || (task.CompletedOn != null && task.CompletedOn.Value.Date == completedOn.Value.Date)) &&
                    (statusId == null || statusId.Value == task.StatusId));
            switch (sortBy)
            {
                case "createdOn":
                    query = query.OrderByDescending(task => task.CreatedOn);
                    break;

                case "completedOn":
                    query = query.OrderByDescending(task => task.CompletedOn);
                    break;
            }
            return await query.ToListAsync();            
        }

        public async Task<List<ToDoTask>> GetAllAsync(int userId)
        {
            return await _dbContext.Tasks.Include(task => task.Status)
                .Where(task => task.UserId == userId)
                .OrderBy(task => task.StatusId)
                .OrderBy(task => task.CreatedOn)
                .ToListAsync();
        }

        public async Task<bool> DeleteTaskAsync(int taskId, int userId)
        {
            var taskToBeDeleted = _dbContext.Tasks.FirstOrDefault(task => task.TaskId == taskId && task.UserId == userId);
            if (taskToBeDeleted == null) { return false; }
            var deleted = _dbContext.Tasks.Remove(taskToBeDeleted);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task DeleteAllAsync(int userId, DateTime? createdOn, DateTime? completedOn)
        {
            var tasksToBeDeleted = _dbContext.Tasks
                            .Where(task => task.UserId == userId &&
                             (createdOn == null || task.CreatedOn.Date == createdOn.Value.Date) &&
                             (completedOn == null || (task.CompletedOn != null && task.CompletedOn.Value.Date == completedOn.Value.Date)));
            if (!tasksToBeDeleted.Any()) { return; }
            _dbContext.Tasks.RemoveRange(tasksToBeDeleted);
            await _dbContext.SaveChangesAsync();
        }
    }
}
