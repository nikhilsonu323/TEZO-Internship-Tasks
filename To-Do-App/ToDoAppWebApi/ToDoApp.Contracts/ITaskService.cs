using ToDoApp.Concerns;

namespace ToDoApp.Contracts
{
    public interface ITaskService
    {
        Task AddTasksAync(TaskDTO task, int userId);

        Task<bool> UpdateTaskAync(TaskDTO task, int userId);

        Task<TaskDTO?> GetTaskAync(int taskId, int userId);

        Task<List<TaskDTO>> GetTasksAync(int userId, DateTime? createdAt, DateTime? completedAt, int? statusId);

        Task<List<TaskDTO>> GetAllTasksAync(int userId);

        Task<bool> DeleteTaskAync(int taskId, int userId);

        Task DeleteAllAync(int userId, DateTime? createdOn, DateTime? completedOn);
    }
}
