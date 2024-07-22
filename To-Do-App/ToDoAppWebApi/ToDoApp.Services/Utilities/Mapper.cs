using ToDoApp.Concerns;
using ToDoApp.Repository.Data.Models;

namespace ToDoApp.Services.Utilities
{
    public class Mapper
    {
        public static User MapToUser(UserDTO userDTO)
        {
            return new User
            {
                Username = userDTO.Username,
                Password = userDTO.Password,
            };
        }

        public static UserDTO MapToUserDTO(User user)
        {
            return new UserDTO
            {
                Username = user.Username,
                Password = user.Password,
            };
        }

        public static ToDoTask MapToTask(TaskDTO taskDTO, int userId)
        {
            return new ToDoTask
            {
                UserId = userId,
                TaskId = taskDTO.TaskId,
                Title = taskDTO.Title,
                Description = taskDTO.Description,
                StatusId = taskDTO.StatusId,
                CreatedOn = taskDTO.CreatedOn,
                CompletedOn = taskDTO.CompletedOn
            };
        }

        public static TaskDTO MapToTaskDTO(ToDoTask toDoTask)
        {
            return new TaskDTO
            {
                TaskId = toDoTask.TaskId,
                Title = toDoTask.Title,
                Description = toDoTask.Description,
                StatusId = toDoTask.StatusId,
                Status = toDoTask.Status.StatusName,
                CreatedOn = toDoTask.CreatedOn,
                CompletedOn = toDoTask.CompletedOn
            };
        }

        public static List<TaskDTO> MapToTaskDTO(List<ToDoTask> toDoTasks)
        {
            var taskDTOs = new List<TaskDTO>();
            foreach (var toDoTask in toDoTasks)
            {
                taskDTOs.Add(MapToTaskDTO(toDoTask));
            }
            return taskDTOs;
        }

        public static Status MapToStatus(StatusDTO status)
        {
            return new Status()
            {
                StatusId = status.Id,
                StatusName = status.StatusName,
            };
        }
        public static StatusDTO MapToStatusDTO(Status status)
        {
            return new StatusDTO()
            {
                Id = status.StatusId,
                StatusName = status.StatusName,
            };
        }

        public static List<StatusDTO> MapToStatusDTO(List<Status> statuses)
        {
            var statuesDTOs = new List<StatusDTO>();
            foreach (var stat in statuses)
            {
                statuesDTOs.Add(MapToStatusDTO(stat));
            }
            return statuesDTOs;
        }
    }
}
