using ToDoApp.Concerns;
using ToDoApp.Contracts;
using ToDoApp.Repository.Interfaces;
using ToDoApp.Services.Utilities;

namespace ToDoApp.Services
{
    public class AuthService : IAuthService
    {

        private readonly IUserRepository _userRepo;
        private readonly IAuthHelper _authHelper;

        public AuthService(IUserRepository userRepo, IAuthHelper authHelper)
        {
            _userRepo = userRepo;
            _authHelper = authHelper;
        }

        public async Task<string?> LoginAsync(UserDTO loginUser)
        {
            var user = await _userRepo.GetUserAsync(loginUser.Username);
            if (user == null)
            {
                return null;
            }
            else
            {
                if (!_authHelper.Verify(user.Password, loginUser.Password))
                {
                    return null;
                }
                return _authHelper.GetToken(user.UserId);
            }
        }

        public async Task<bool> RegisterAsync(UserDTO userDTO)
        {
            var user = await _userRepo.GetUserAsync(userDTO.Username);
            if (user != null)
            {
                return false;
            }
            var userToAdd = Mapper.MapToUser(userDTO);
            userToAdd.Password = _authHelper.Hash(userDTO.Password);

            await _userRepo.AddUserAsync(userToAdd);
            return true;
        }
    }
}
