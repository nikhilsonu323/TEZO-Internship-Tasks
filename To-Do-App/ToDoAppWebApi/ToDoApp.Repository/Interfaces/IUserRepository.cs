using ToDoApp.Repository.Data.Models;

namespace ToDoApp.Repository.Interfaces
{
    public interface IUserRepository
    {
        Task<User> AddUserAsync(User user);
        Task<User?> GetUserAsync(String username);
    }
}
