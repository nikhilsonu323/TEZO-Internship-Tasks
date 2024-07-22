using ToDoApp.Repository.Data.Models;

namespace ToDoApp.Repository.Interfaces
{
    public interface IStatusRepository
    {
        Task AddAsync(Status status);
        Task<List<Status>> GetStatuses();
    }
}
