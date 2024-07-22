using ToDoApp.Concerns;
using ToDoApp.Contracts;
using ToDoApp.Repository.Interfaces;
using ToDoApp.Services.Utilities;

namespace ToDoApp.Services
{
    public class TaskService : ITaskService
    {
        private ITaskRepository _taskRepo;

        public TaskService(ITaskRepository taskRepo)
        {
            _taskRepo = taskRepo;
        }

        public async Task AddTasksAync(TaskDTO task, int userId)
        {
            task.CreatedOn = DateTime.Now;
            await _taskRepo.AddTaskAsync(Mapper.MapToTask(task, userId));
        }

        public async Task<TaskDTO?> GetTaskAync(int taskId, int userId)
        {
            var task = await _taskRepo.GetTaskAsync(taskId, userId);
            if(task == null) { return null; }
            return Mapper.MapToTaskDTO(task);
        }

        public async Task<List<TaskDTO>> GetTasksAync(int userId, DateTime? createdOn, DateTime? completedOn, int? statusId)
        {
            string sortBy = string.Empty;
            if(statusId != null)
            {
                if (statusId.Value == (int)Statuses.Active)
                    sortBy = "createdOn";

                if (statusId.Value == (int)Statuses.Completed)
                    sortBy = "completedOn";
            }
            var tasks = await _taskRepo.GetTasksAsync(userId, createdOn, completedOn, statusId, sortBy);
            return Mapper.MapToTaskDTO(tasks);
        }

        public async Task<List<TaskDTO>> GetAllTasksAync(int userId)
        {
            var tasks = await _taskRepo.GetAllAsync(userId);
            return Mapper.MapToTaskDTO(tasks);
        }

        public Task<bool> UpdateTaskAync(TaskDTO task, int userId)
        {
            if(task.StatusId == (int)Statuses.Completed)
            {
                task.CompletedOn = DateTime.Now;
            }
            return _taskRepo.UpdateTaskAsync(Mapper.MapToTask(task, userId));
        }

        public Task<bool> DeleteTaskAync(int taskId, int userId)
        {
            return _taskRepo.DeleteTaskAsync(taskId, userId);
        }

        public async Task DeleteAllAync(int userId, DateTime? createdOn, DateTime? completedOn)
        {
            await _taskRepo.DeleteAllAsync(userId, createdOn, completedOn);
        }

    }
}
