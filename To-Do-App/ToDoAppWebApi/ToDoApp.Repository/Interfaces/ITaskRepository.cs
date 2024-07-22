using ToDoApp.Repository.Data.Models;

namespace ToDoApp.Repository.Interfaces
{
    public interface ITaskRepository
    {
        Task AddTaskAsync(ToDoTask task);
        Task<bool> UpdateTaskAsync(ToDoTask task);
        Task<ToDoTask?> GetTaskAsync(int taskId, int userId);        
        Task<List<ToDoTask>> GetTasksAsync(int userId, DateTime? createdOn, DateTime? completedOn, int? statusId, string? sortBy = null);
        Task<List<ToDoTask>> GetAllAsync(int userId);
        Task<bool> DeleteTaskAsync(int taskId, int userId);
        Task DeleteAllAsync(int userId, DateTime? createdOn, DateTime? completedOn);
    }
}
