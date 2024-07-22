using ToDoApp.Concerns;

namespace ToDoApp.Contracts
{
    public interface IStatusService
    {
        Task AddAsync(StatusDTO status);
        Task<List<StatusDTO>> GetStatusesAsync();   
    }
}
