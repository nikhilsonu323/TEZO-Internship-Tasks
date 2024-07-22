using ToDoApp.Concerns;
using ToDoApp.Contracts;
using ToDoApp.Repository.Interfaces;
using ToDoApp.Services.Utilities;

namespace ToDoApp.Services
{
    public class StatusService : IStatusService
    {
        private readonly IStatusRepository _statusRepo;

        public StatusService(IStatusRepository statusRepo)
        {
            _statusRepo = statusRepo;
        }

        public async Task AddAsync(StatusDTO status)
        { 
            await _statusRepo.AddAsync(Mapper.MapToStatus(status));
        }

        public async Task<List<StatusDTO>> GetStatusesAsync()
        {
            var statuses =  await _statusRepo.GetStatuses();
            return Mapper.MapToStatusDTO(statuses);
        }
    }
}
