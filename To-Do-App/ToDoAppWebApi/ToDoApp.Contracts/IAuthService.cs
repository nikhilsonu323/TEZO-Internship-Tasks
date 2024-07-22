using ToDoApp.Concerns;

namespace ToDoApp.Contracts
{
    public interface IAuthService
    {
        public Task<string?> LoginAsync(UserDTO loginUser);

        public Task<bool> RegisterAsync(UserDTO loginUser);

    }
}
