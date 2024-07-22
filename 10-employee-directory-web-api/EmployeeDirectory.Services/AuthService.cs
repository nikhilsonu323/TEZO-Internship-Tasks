using EmployeeDirectory.Concerns.DTO_s;
using EmployeeDirectory.Concerns.Interfaces;
using EmployeeDirectory.Repository.Interfaces;
using EmployeeDirectory.Repository.ScaffoldData.DataConcerns;
using EmployeeDirectory.Services.Utilities;

namespace EmployeeDirectory.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepo _userRepo;
        private readonly PasswordHasher _passwordHasher;
        private readonly TokenHandler _tokenHandler;

        public AuthService(IUserRepo userRepo, PasswordHasher passwordHasher, TokenHandler tokenHandler)
        {
            _userRepo = userRepo;
            _passwordHasher = passwordHasher;
            _tokenHandler = tokenHandler;
        }

        public AuthResponse? Login(LoginDTO loginUser)
        {
            var user = _userRepo.Get(loginUser.Email);
            if (user == null)
            {
                return null;
            }
            else
            {
                if (!_passwordHasher.Verify(user.Password, loginUser.Password))
                {
                    return null;
                }
                return GenerateAuthResponse(user);
            }
        }

        public AuthResponse? SignUp(AddUserDTO userDTO)
        {
            var userToAdd = Mapper.MapToUser(userDTO);
            userToAdd.Password = _passwordHasher.Hash(userDTO.Password);
            var user = _userRepo.Add(userToAdd);
            if (user == null)
            {
                return null;
            }
            return GenerateAuthResponse(user);
        }

        private AuthResponse GenerateAuthResponse(User user)
        {
            var expiresAt = DateTime.Now.AddDays(1);
            TimeSpan timeDifference = expiresAt - DateTime.Now;

            return new AuthResponse()
            {
                Email = user.Email,
                Name = user.Name,
                ImageData = user.ImageData,
                Token = _tokenHandler.GetToken(user, expiresAt),
                ExpiresIn = timeDifference.TotalSeconds
            };
        }
    }
}
